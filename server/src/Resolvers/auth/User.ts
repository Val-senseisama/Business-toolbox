

import { ThrowError, SaveAuditTrail, MakeID } from "../../Helpers/Helpers.js";
import { DBObject } from "../../Helpers/MySQL.js";
import { Validate } from "../../Helpers/Validate.js";
import setJWT from "../../Helpers/setJWT.js";
import { DateTime } from 'luxon';
import bcrypt from "bcrypt";
import CONFIG from "../../config/config.js";


const SALT_ROUNDS = 10;

export default {
    Mutation: {
        async login(_, { email, password }: Record<string, string>, context: Record<string, any>) {
            if (!Validate.email(email)) {
                ThrowError("#Invalid Email");
            }
            if (!Validate.string(password)) {
                ThrowError("#Invalid password");
            }

            const user = await DBObject.findOne('users', { email });
            if (!user) {
                ThrowError('#Invalid login credentials');
            }

            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
                ThrowError('#Invalid login credentials');
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
        },

        async register(_, { email, password, title, firstname, lastname, phonenumber }: Record<string, string>, context: Record<string, any>) {
            if (!Validate.email(email)) {
                ThrowError("#Invalid Email");
            }
            if (!Validate.string(password)) {
                ThrowError("Invalid password");
            }
            if (!firstname) {
                ThrowError("Invalid firstname");
            }
            if (!lastname) {
                ThrowError("Invalid lastname");
            }
            if (!Validate.phone(phonenumber)) {
                ThrowError("Invalid Phone_number");
            }

            let existingUser = await DBObject.findOne('users', { email }, { columns: 'id' });
            if (existingUser) {
                ThrowError('This email is already registered');
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

            // Create a verification token and save it in the tokens table
            // Here you would typically send an email with a verification token

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
        },

        async forgotPassword(_, { email }: { email: string }, context: Record<string, any>) {
            if (!Validate.email(email)) {
                ThrowError("#Invalid Email");
            }

            const user = await DBObject.findOne('users', { email });
            if (!user) {
                ThrowError('#User not found');
            }

            const token = MakeID(6);
            const expires_at = DateTime.now().plus({ minutes: CONFIG.settings.PASSWORD_RESET_TOKEN_VALIDITY_MINUTES }).toISO();

            await DBObject.insertOne('tokens', { email, token, expires_at, status: "PENDING" });

            // Here you would typically send an email with the token

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
        },

        async resetPassword(_, { email, token, password }: Record<string, string>, context: Record<string, any>) {
            if (!Validate.email(email)) {
                ThrowError("Invalid Email");
            }
            if (!Validate.string(token)) {
                ThrowError("Invalid Token");
            }
            if (!Validate.string(password)) {
                ThrowError('New password is required!.');
            }

            const tokenRecord = await DBObject.findOne('tokens', { email, token, status: "PENDING" });
            if (!tokenRecord || DateTime.fromISO(tokenRecord.expires_at) < DateTime.now()) {
                ThrowError('Invalid or expired token');
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
        },

        async updateProfile(_: any, { title, firstname, lastname, phone, gender, date_of_birth }: Record<string, string>, context: Record<string, any>) {
            if (!context.id) {
                ThrowError("#RELOGIN");
            }

            if (!firstname) {
                ThrowError("Invalid firstname");
            }
            if (!lastname) {
                ThrowError("Invalid lastname");
            }
            if (!Validate.phone(phone)) {
                ThrowError("Invalid Phone");
            }
            if (!Validate.date(date_of_birth)) {
                ThrowError("Invalid date_of_birth");
            }

            const formattedPhone = Validate.formatPhone(phone);

            // use luxon to get day of the year from date of birth
            const day_of_birth = DateTime.fromFormat(date_of_birth, 'yyyy-MM-dd').ordinal;

            const updatedUser = {
                title,
                firstname,
                lastname,
                phone: formattedPhone,
                gender,
                date_of_birth,
                day_of_birth
            };

            await DBObject.updateOne('users', updatedUser, { id: context.id });

            SaveAuditTrail({
                user_id: context.id,
                email: context.email,
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

            if (!oldPassword || oldPassword.length < 1) {
                ThrowError('Old password is required.');
            }
            if (!newPassword || newPassword.length < 1) {
                ThrowError('New password is required!.');
            }

            const user = await DBObject.findOne('users', { id: context.id }, { columns: 'password' });
            if (!user) {
                ThrowError("#RELOGIN");
            }
            const isValid = await bcrypt.compare(oldPassword, user.password);
            if (!isValid) {
                ThrowError('Invalid old password');
            }

            const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
            await DBObject.updateOne('users', { password: hashedPassword }, { id: context.id });

            SaveAuditTrail({
                user_id: context.id,
                email: context.email,
                company_id: 0,
                branch_id: 0,
                task: 'CHANGE_PASSWORD',
                details: 'User changed their password'
            });

            return 1;
        },

        async verifyEmail(_, { token, email }: Record<string, string>, context: Record<string, any>) {
            if (!context.id) {
                ThrowError('#RELOGIN');
            }
            if (!Validate.email(email)) {
                ThrowError("#Invalid Email");
            }
            if (!Validate.string(token)) {
                ThrowError("#Invalid token");
            }

            const tokenRecord = await DBObject.findOne('tokens', { email, token, status: "PENDING" });
            if (!tokenRecord || DateTime.fromISO(tokenRecord.expires_at) < DateTime.now()) {
                ThrowError('#Invalid or expired token');
            }

            await DBObject.updateOne('users', { email_verified: true }, { email });
            await DBObject.updateOne('tokens', { status: "USED" }, { id: tokenRecord.id });

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

            return 1;
        },

        async updateFirebaseToken(_, { token }: { token: string }, context: Record<string, any>) {
            if (!context.id) {
                ThrowError("#RELOGIN");
            }

            if (!Validate.string(token)) {
                ThrowError("#Invalid token");
            }

            DBObject.updateOne('users', { firebase_token: token }, { id: context.id })
                .catch(err => {
                    /** do nothing **/
                })

            return 1;
        },

        async updateUserSettings(_, { settings }, context: Record<string, any>) {
            if (!context.id) {
                ThrowError("#RELOGIN");
            }

            if (!Validate.object(settings)) {
                ThrowError("#Invalid settings");
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
        }
    },

    Query: {
        async currentUser(_, __, context: Record<string, any>) {
            if (!context.id) {
                ThrowError("#RELOGIN");
            }

            const user = await DBObject.findOne('users', { id: context.id });
            if (!user) {
                ThrowError("#USER_NOT_FOUND");
            }

            return {
                ...user,
                settings: JSON.parse(user.settings || "{}"),
                data: JSON.parse(user.data || "{}")
            };
        },

        getConfig: async (_, __, context: Record<string, any>) => {
            if (!context.id) {
                ThrowError("#RELOGIN");
            }

            return CONFIG.client;
        },

    }
};