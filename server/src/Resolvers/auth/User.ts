

import { ThrowError, SaveAuditTrail, MakeID } from "../../Helpers/Helpers.js";
import { DBObject } from "../../Helpers/MySQL.js";
import { Validate } from "../../Helpers/Validate.js";
import setJWT from "../../Helpers/setJWT.js";
import { DateTime } from 'luxon';
import bcrypt from "bcrypt";
import CONFIG from "../../config/config.js";
import { uuid } from "../../Helpers/Helpers.js";
import SendMail from "../../Helpers/SendMail.js";
import MailInput  from "../../Helpers/SendMail.js";

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
                    email: user.email,
                    company_id: 0,
                    branch_id: 0,
                    task: 'LOGIN',
                    details: `User ${user.firstname} ${user.lastname} logged in`,
                    ip_address: context.ip,
                    browser_agents: context.userAgent,
                });

                return jwt;
            } catch (error) {
                ThrowError(error);
            }
        },

        async register(_: any, { email, password, title, firstname, lastname, phonenumber }: Record<string, string>, context: Record<string, any>) {
            try {
                if (!Validate.email(email)) {
                    ThrowError("Invalid Email.");
                }
                if (!Validate.string(password)) {
                    ThrowError("Invalid password.");
                }
                if (!firstname) {
                    ThrowError("Invalid firstname.");
                }
                if (!lastname) {
                    ThrowError("Invalid lastname.");
                }
                if (!Validate.phone(phonenumber)) {
                    ThrowError("Invalid phone number.");
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

                };

                const userId = await DBObject.insertOne('users', newUser);

                const verificationToken = uuid();
                const expiry = DateTime.now().plus({ minutes: 10 }).toSQLDate();

                await DBObject.insertOne('tokens', {
                    email,
                    token: verificationToken,
                    user_id: userId,
                    status: 'PENDING',
                    expires_at: expiry,
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
                    ThrowError(error);
                }

                SaveAuditTrail({
                    user_id: userId,
                    email,
                    company_id: 0,
                    branch_id: 0,
                    task: 'REGISTER',
                    details: `New user registered (${firstname} ${lastname})`,
                    ip_address: context.ip,
                    browser_agents: context.userAgent,
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
                    ThrowError('User not found');
                }

                const token = MakeID(6);
                const expiry = DateTime.now().plus({ minutes: CONFIG.settings.PASSWORD_RESET_TOKEN_VALIDITY_MINUTES }).toSQLDate();

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
                    email: user.email,
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
                    email: user.email,
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

            if (!firstname) {
                ThrowError("firstname is required.");
            }
            if (!lastname) {
                ThrowError("lastname is required.");
            }
            if (!Validate.phone(phone)) {
                ThrowError("Invalid Phone number.");
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

            try {
                SaveAuditTrail({
                    user_id: context.id,
                    email: context.email,
                    company_id: 0,
                    branch_id: 0,
                    task: 'UPDATE_PROFILE',
                    details: 'User updated their profile'
                });
            } catch (error) {
                ThrowError(error);
            }

            try {
                return await DBObject.findOne('users', { id: context.id });
            } catch (error) {
                ThrowError(error);
            }
        },

        async changePassword(_, { oldPassword, newPassword }: Record<string, string>, context: Record<string, any>) {
            if (!context.id) {
                ThrowError("#RELOGIN");
            }

            if (!oldPassword || oldPassword.length < 1) {
                ThrowError('Old password is required.');
            }
            if (!newPassword || newPassword.length < 1) {
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
                ThrowError(error);
            }

            let updated: number = 0;
            try {
                const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
                updated = await DBObject.updateOne('users', { password: hashedPassword }, { id: context.id });
            } catch (error) {
                ThrowError(error);
            }

            if (updated < 1) {
                ThrowError("Unable to update password.");
            }

            try {
                SaveAuditTrail({
                    user_id: context.id,
                    email: context.email,
                    company_id: 0,
                    branch_id: 0,
                    task: 'CHANGE_PASSWORD',
                    details: 'User changed their password'
                });
            } catch (error) {
                ThrowError(error);
            }

            return 1;
        },

        async verifyEmail(_, { token, email }: Record<string, string>, context: Record<string, any>) {
            if (!context.id) {
                ThrowError('#RELOGIN');
            }
            if (!Validate.email(email)) {
                ThrowError("Invalid Email");
            }
            if (!Validate.string(token)) {
                ThrowError("Invalid token");
            }

            let updated: number = 0;
            try {
                const tokenRecord = await DBObject.findOne('tokens', { email, token, status: "PENDING" });
                if (!tokenRecord || DateTime.fromSQL(tokenRecord.expires_at) < DateTime.now()) {
                    ThrowError('#Invalid or expired token');
                }

                updated = await DBObject.updateOne('users', { email_verified: true }, { email });
                updated = await DBObject.updateOne('tokens', { status: "USED" }, { id: tokenRecord.id });

                const user = await DBObject.findOne('users', { email });

                SaveAuditTrail({
                    user_id: user.id,
                    email: user.email,
                    company_id: 0,
                    branch_id: 0,
                    task: 'VERIFY_EMAIL',
                    details: 'User verified their email',
                    ip_address: context.ip,
                    browser_agents: context.userAgent,
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
            try {
                if (!context.id) {
                    ThrowError("#RELOGIN");
                }

                if (!Validate.string(token)) {
                    ThrowError("Invalid token.");
                }

                try {
                    await DBObject.updateOne('users', { firebase_token: token }, { id: context.id });
                } catch (error) {
                    /** do nothing **/
                }

                return 1;
            } catch (error) {
                ThrowError(error);
            }
        },

        async updateUserSettings(_, { settings }, context: Record<string, any>) {
            try {
                if (!context.id) {
                    ThrowError("#RELOGIN");
                }

                if (!Validate.object(settings)) {
                    ThrowError("Invalid settings.");
                }

                const updatedSettings = JSON.stringify(settings);
                await DBObject.updateOne('users', { settings: updatedSettings }, { id: context.id });

                SaveAuditTrail({
                    user_id: context.id,
                    email: context.email,
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
            try {
                if (!context.id) {
                    ThrowError("#RELOGIN");
                }

                const user = await DBObject.findOne('users', { id: context.id });
                if (!user) {
                    ThrowError("User not found.");
                }

                return {
                    ...user,
                    settings: JSON.parse(user.settings || "{}"),
                    data: JSON.parse(user.data || "{}")
                };
            } catch (error) {
                ThrowError(error);
            }
        },

        getConfig: async (_, __, context: Record<string, any>) => {
            try {
                if (!context.id) {
                    ThrowError("#RELOGIN");
                }

                return CONFIG.client;
            } catch (error) {
                ThrowError(error);
            }
        },

    }
};
