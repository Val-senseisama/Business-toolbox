

import { ThrowError, SaveAuditTrail, MakeID, log } from "../../Helpers/Helpers.js";
import { DBObject } from "../../Helpers/MySQL.js";
import { Validate } from "../../Helpers/Validate.js";
import setJWT from "../../Helpers/setJWT.js";
import { DateTime } from 'luxon';
import bcrypt from "bcrypt";
import CONFIG from "../../config/config.js";
import { uuid } from "../../Helpers/Helpers.js";
import SendMail from "../../Helpers/SendMail.js";
import MailInput from "../../Helpers/SendMail.js";

type MailInput = {
    recipients: string;
    subject: string;
    message: string;
    attachment?: any[];
};


const SALT_ROUNDS = 10;

export default {
    Mutation: {
        async login(_: any, { email, password }: Record<string, string>, context: Record<string, any>) {
            try {
                if (!Validate.email(email)) {
                    ThrowError("Invalid email.");
                }
                if (!Validate.string(password)) {
                    ThrowError("Invalid password.");
                }

                const user = await DBObject.findOne('users', { email });
                if (!user) {
                    ThrowError('Invalid login credentials.');
                }

                const isValid = await bcrypt.compare(password, user.password);
                if (!isValid) {
                    ThrowError('Invalid login credentials.');
                }

                let jwt = await setJWT(user.id);

                SaveAuditTrail({
                    user_id: user.id,
                    name: `${user.title} ${user.firstname} ${user.lastname}`,
                    company_id: 0,
                    branch_id: 0,
                    task: 'LOGIN',
                    details: `${user.firstname} ${user.lastname} logged in`
                });

                return jwt;
            } catch (error) {
                ThrowError(error);
            }
        },

        async register(_: any, { email, password, title, firstname, lastname, phonenumber, date_of_birth, gender }: Record<string, string>, context: Record<string, any>) {
            try {
                if (!Validate.email(email)) {
                    ThrowError("Invalid Email.");
                }
                if (!Validate.string(password)) {
                    ThrowError("Invalid password.");
                }
                if (!Validate.string(title)) {
                    ThrowError("Invalid title.");
                }
                if (!Validate.string(firstname)) {
                    ThrowError("Invalid firstname.");
                }
                if (!Validate.string(lastname)) {
                    ThrowError("Invalid lastname.");
                }
                if (!Validate.phone(phonenumber)) {
                    ThrowError("Invalid phone number.");
                }
                if (!Validate.string(date_of_birth)) {
                    ThrowError("Invalid date of birth.");
                }
                const Gender = ['Male', 'Female'];
                if (!Gender.includes(gender)) {
                    ThrowError("Invalid gender.");
                }

                let existingUser = await DBObject.findOne('users', { email }, { columns: 'id' });
                if (existingUser) {
                    ThrowError('This email is already registered.');
                }

                const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
                const formattedPhone = Validate.formatPhone(phonenumber);

                const newUser = {
                    email,
                    password: hashedPassword,
                    title,
                    firstname: firstname,
                    lastname: lastname,
                    phone: formattedPhone,
                    date_of_birth: DateTime.fromSQL(date_of_birth).toSQL({ includeOffset: false }),
                    gender: gender,

                };

                const userId = await DBObject.insertOne('users', newUser);

                if (!Validate.positiveInteger(userId)) {
                    ThrowError("Unable to create user.");
                }

                const verificationToken = MakeID(6);

                await DBObject.insertOne('tokens', {
                    email,
                    token: verificationToken,
                    status: 'PENDING',
                    expires_at: DateTime.now().plus({ minutes: CONFIG.settings.PASSWORD_RESET_TOKEN_VALIDITY_MINUTES }).toSQL({includeOffset: false}),
                });

                try {
                    const emailInput: MailInput = {
                        recipients: email,
                        subject: 'Account Registration Token',
                        message: `<div>
                          <h1>Hello ${firstname}</h1>
                          <p>Use this code to register: ${verificationToken}</p>
                        </div>`,
                    };
                    await SendMail(emailInput);
                } catch (error) {
                    log("Register", error);
                }

                SaveAuditTrail({
                    user_id: userId,
                    name: `${title} ${firstname} ${lastname}`,
                    company_id: 0,
                    branch_id: 0,
                    task: 'REGISTER',
                    details: `New user registered (${title} ${firstname} ${lastname})`
                });

                return userId;
            } catch (error) {
                ThrowError(error);
            }
        },

        async forgotPassword(_: any, { email }: { email: string }, context: Record<string, any>) {
            try {
                if (!Validate.email(email)) {
                    ThrowError("Invalid Email");
                }

                const user = await DBObject.findOne('users', { email });
                if (!user) {
                    ThrowError('Email address is not registered.');
                }

                const token = MakeID(6);
                const expiry = DateTime.now().plus({ minutes: CONFIG.settings.PASSWORD_RESET_TOKEN_VALIDITY_MINUTES }).toSQL({ includeOffset: false });
                console.log("expiry:", expiry);
                await DBObject.insertOne('tokens', { email, token, expires_at: expiry, status: "PENDING" });

                try {
                    const emailInput: MailInput = {
                        recipients: email,
                        subject: 'Password Reset OTP',
                        message: `<div>
                          <h1>Hello ${user.firstname}</h1>
                          <p>Use this code to reset your password: ${token}</p>
                        </div>`,
                    };
                    await SendMail(emailInput);
                } catch (error) {
                    ThrowError(error);
                }

                SaveAuditTrail({
                    user_id: user.id,
                    name: `${user.title} ${user.firstname} ${user.lastname}`,
                    company_id: 0,
                    branch_id: 0,
                    task: 'FORGOT_PASSWORD',
                    details: 'User requested password reset',
                    ip_address: context.ip,
                    browser_agents: context.userAgent,
                });

                return 1;
            } catch (error) {
                ThrowError(error);
            }
        },

        async resetPassword(_: any, { email, token, password }: Record<string, string>, context: Record<string, any>) {
            try {
                if (!Validate.email(email)) {
                    ThrowError("Invalid email.");
                }
                if (!Validate.string(token)) {
                    ThrowError("Invalid token.");
                }
                if (!Validate.string(password)) {
                    ThrowError('New password is required!.');
                }

                const tokenRecord = await DBObject.findOne('tokens', { email, token, status: "PENDING" });
                if (!tokenRecord || DateTime.fromSQL(tokenRecord.expires_at) < DateTime.now()) {
                    ThrowError('Invalid or expired token.');
                }

                const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
                await DBObject.updateOne('users', { password: hashedPassword }, { email });
                await DBObject.updateOne('tokens', { status: "USED" }, { id: tokenRecord.id });

                const user = await DBObject.findOne('users', { email });
                let jwt = await setJWT(user.id);

                SaveAuditTrail({
                    user_id: user.id,
                    name: `${user.title} ${user.firstname} ${user.lastname}`,
                    company_id: 0,
                    branch_id: 0,
                    task: 'RESET_PASSWORD',
                    details: `${user.firstname} ${user.lastname} reset password successfully`
                });

                return jwt;
            } catch (error) {
                ThrowError(error);
            }
        },

        async updateProfile(_: any, { title, firstname, lastname, phone, gender, date_of_birth }: Record<string, string>, context: Record<string, any>) {
            if (!context.id) {
                ThrowError("#RELOGIN");
            }

            if (!Validate.string(firstname)) {
                ThrowError("firstname is required.");
            }
            if (!Validate.string(lastname)) {
                ThrowError("lastname is required.");
            }
            if (!Validate.phone(phone)) {
                ThrowError("Invalid Phone number.");
            }
            if (!Validate.string(gender)) {
                ThrowError("Invalid gender.");
            }
            if (!Validate.date(date_of_birth)) {
                ThrowError("Invalid date_of_birth");
            }

            let updated: number = 0;
            try {
                const formattedPhone = Validate.formatPhone(phone);

                // use luxon to get day of the year from date of birth
                const day_of_birth = DateTime.fromFormat(date_of_birth, 'yyyy-MM-dd').ordinal.toString();

                const updatedUser: Record<string, string> = {
                    title,
                    firstname,
                    lastname,
                    phone: formattedPhone,
                    gender,
                    date_of_birth,
                    day_of_birth
                };

                updated = await DBObject.updateOne('users', updatedUser, { id: context.id });
            } catch (error) {
                ThrowError(error);
            }

            if (updated < 1) {
                ThrowError("Unable to update profile");
            }

            SaveAuditTrail({
                user_id: context.id,
                name: context.name,
                company_id: 0,
                branch_id: 0,
                task: 'UPDATE_PROFILE',
                details: 'User updated their profile'
            });

            return await DBObject.findOne('users', { id: context.id });
        },

        async changePassword(_, { oldPassword, newPassword }: Record<string, string>, context: Record<string, any>) {
            if (!context.id) {
                ThrowError("#RELOGIN");
            }

            if (!Validate.string(oldPassword) || oldPassword.length < 1) {
                ThrowError('Old password is required.');
            }
            if (!Validate.string(newPassword) || newPassword.length < 1) {
                ThrowError('New password is required!.');
            }

            try {
                const user = await DBObject.findOne('users', { id: context.id }, { columns: 'password' });
                if (!user) {
                    ThrowError("#RELOGIN");
                }
                const isValid = await bcrypt.compare(oldPassword, user.password);
                if (!isValid) {
                    ThrowError('Invalid old password.');
                }
            } catch (error) {
                log("changePassword", error);
                ThrowError("Unable to change password. Please ry again");
            }

            let updated: number = 0;
            try {
                const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
                updated = await DBObject.updateOne('users', { password: hashedPassword }, { id: context.id });
            } catch (error) {
                log("changePassword", error);
                ThrowError("Unable to change password. Please try again");
            }

            if (updated < 1) {
                ThrowError("Unable to update password.");
            }

            try {
                SaveAuditTrail({
                    user_id: context.id,
                    name: context.name,
                    company_id: 0,
                    branch_id: 0,
                    task: 'CHANGE_PASSWORD',
                    details: 'Changed password'
                });
            } catch (error) {
                ThrowError(error);
            }

            return 1;
        },

        async verifyEmail(_, { token, email }: Record<string, string>, context: Record<string, any>) {
            
            if (!Validate.email(email)) {
                ThrowError("Invalid Email");
            }
            if (!Validate.string(token)) {
                ThrowError("Invalid code");
            }

            let updated: number = 0;
            try {
                const tokenRecord = await DBObject.findOne('tokens', { email, token, status: "PENDING" });
                if (!tokenRecord || DateTime.fromSQL(tokenRecord.expires_at) < DateTime.now()) {
                    ThrowError('Invalid or expired token');
                }

                updated = await DBObject.updateOne('users', { status: "ACTIVE" }, { email });
                DBObject.updateOne('tokens', { status: "USED" }, { id: tokenRecord.id });

                const user = await DBObject.findOne('users', { email });

                SaveAuditTrail({
                    user_id: user.id,
                    name: `${user.title} ${user.firstname} ${user.lastname}`,
                    company_id: 0,
                    branch_id: 0,
                    task: 'VERIFY_EMAIL',
                    details: 'User verified their email'
                });
            } catch (error) {
                ThrowError(error);
            }

            if (updated < 1) {
                ThrowError("Unable to verify email.");
            }

            return 1;
        },

        async updateFirebaseToken(_, { token }: { token: string }, context: Record<string, any>) {

            if (!context.id) {
                ThrowError("#RELOGIN");
            }

            if (!Validate.string(token)) {
                ThrowError("Invalid token.");
            }

            DBObject.updateOne('users', { firebase_token: token }, { id: context.id })
                .catch((error) => {
                    log("updateFirebaseToken", error);
                });

            return 1;
        },

        async updateUserSettings(_, { settings }, context: Record<string, any>) {

            if (!context.id) {
                ThrowError("#RELOGIN");
            }

            if (!Validate.object(settings)) {
                ThrowError("Invalid settings.");
            }
            try {
                const updatedSettings = JSON.stringify(settings);
                const updated = await DBObject.updateOne('users', { settings: updatedSettings }, { id: context.id });

                if (!Validate.positiveInteger(updated)) {
                    ThrowError("Unable to update settings.");
                }

                SaveAuditTrail({
                    user_id: context.id,
                    name: context.name,
                    company_id: 0,
                    branch_id: 0,
                    task: 'UPDATE_USER_SETTINGS',
                    details: 'User updated their settings'
                });

                return settings;
            } catch (error) {
                ThrowError(error);
            }
        }
    },

    Query: {
        async currentUser(_, __, context: Record<string, any>) {
           // console.log(context);
            
            if (!context.id) {
                ThrowError("#RELOGIN");
            }

            try {
                const user = await DBObject.findOne('users', { id: context.id }, {columns: "id, title, firstname, lastname, email, phone, date_of_birth, gender, settings, data, created_at"});
                if (!user) {
                    ThrowError("User not found.");
                }
                let settings = {};
                let data = {};
                try {
                    settings = JSON.parse(user.settings);
                } catch (error) {
                    settings = {};
                }
                try {
                    data = JSON.parse(user.data || "{}");
                } catch (error) {
                    data = {};
                }
                return {
                    id: user.id,
                    title: user.title,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    phone: user.phone,
                    date_of_birth: user.date_of_birth,
                    gender: user.gender,
                    settings,
                    data
                };
            } catch (error) {
                ThrowError(error);
            }
        },

        getConfig: async (_, __, context: Record<string, any>) => {
            if (!context.id) {
                ThrowError("#RELOGIN");
            }

            return CONFIG.client;
        },

    }
};
