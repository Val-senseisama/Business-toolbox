

    import { ThrowError, SaveAuditTrail } from "../../Helpers/Helpers.js";
    import { DBObject } from "../../Helpers/MySQL.js";
    import { Validate } from "../../Helpers/Validate.js";
    import setJWT from "../../Helpers/setJWT.js";
    import { DateTime } from 'luxon';
    import bcrypt from "bcrypt";
    import CONFIG from "../../config/config.js";

    
    const SALT_ROUNDS = 10;
    
    export default {
        Mutation: {
            async login(_, { email, password }, context) {
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
                await DBObject.updateOne('users', { refresh_secret: jwt.refreshToken }, { id: user.id });
    
                SaveAuditTrail({
                    user_id: user.id,
                    email: user.email,
                    company_id: 0,
                    branch_id: 0,
                    task: 'LOGIN',
                    details: 'User logged in',
                    ip_address: context.ip,
                    browser_agents: context.userAgent,
                });
    
                return jwt;
            },
    
            async register(_, { email, password, title, firstname, lastname, phonenumber }, context) {
                if (!Validate.email(email)) {
                    ThrowError("#Invalid Email");
                }
                if (!Validate.string(password)) {
                    ThrowError("#Invalid password");
                }
                if (!firstname) {
                    ThrowError("#Invalid firstname");
                }
                if (!lastname) {
                    ThrowError("#Invalid lastname");
                }
                if (!Validate.phone(phonenumber)) {
                    ThrowError("#Invalid Phone_number");
                }
    
                let existingUser = await DBObject.findOne('users', { email });
                if (existingUser) {
                    ThrowError('#This email is already registered');
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
    
            async forgotPassword(_, { email }, context) {
                if (!Validate.email(email)) {
                    ThrowError("#Invalid Email");
                }
    
                const user = await DBObject.findOne('users', { email });
                if (!user) {
                    ThrowError('#User not found');
                }
    
                const token = Math.random().toString(36).substring(2, 15);
                const expires_at = DateTime.now().plus({ hours: 1 }).toUTC().toISO();
    
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
    
            async resetPassword(_, { email, token, password }, context) {
                if (!context.id) {
                    ThrowError('#RELOGIN');
                }
                if (!Validate.email(email)) {
                    ThrowError("#Invalid Email");
                }
                if (!Validate.string(token)) {
                    ThrowError("#Invalid Token");
                }
                if (!Validate.string(password)) {
                    ThrowError('#New password is required!.');
                }
    
                const tokenRecord = await DBObject.findOne('tokens', { email, token, status: "PENDING" });
                if (!tokenRecord || DateTime.fromISO(tokenRecord.expires_at) < DateTime.now()) {
                    ThrowError('I#nvalid or expired token');
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
                    details: 'User reset their password',
                    ip_address: context.ip,
                    browser_agents: context.userAgent,
                });
    
                return jwt;
            },
    
            async updateProfile(_, { title, firstname, lastname, phone, gender, date_of_Birth }, context) {
                if (!context.id) {
                    ThrowError("#RELOGIN");
                  }
    
                  if (!firstname) {
                    ThrowError("#Invalid firstname");
                }
                if (!lastname) {
                    ThrowError("#Invalid lastname");
                }
                if (!Validate.phone(phone)) {
                    ThrowError("#Invalid Phone");
                }
                if (!Validate.date(date_of_Birth)) {
                    ThrowError("#Invalid date_of_birth");
                }
    
                const formattedPhone = Validate.formatPhone(phone);
    
                const updatedUser = {
                    title,
                    firstname,
                    lastname,
                    phone: formattedPhone,
                    gender,
                    date_of_birth: date_of_Birth,
                };
    
                await DBObject.updateOne('users', updatedUser, { id: context.id });
    
                SaveAuditTrail({
                    user_id: context.id,
                    email: context.email,
                    company_id: 0,
                    branch_id: 0,
                    task: 'UPDATE_PROFILE',
                    details: 'User updated their profile',
                    ip_address: context.ip,
                    browser_agents: context.userAgent,
                });
    
                return await DBObject.findOne('users', { id: context.id });
            },
    
            async changePassword(_, { oldPassword, newPassword }, context) {
                if (!context.id) {
                    ThrowError("#RELOGIN");
                  }
    
                  if (!oldPassword || oldPassword.length < 1) {
                    ThrowError('#Old password is required.');
                }
                if (!newPassword) {
                    ThrowError('#New password is required!.');
                }
    
                const user = await DBObject.findOne('users', { id: context.id });
                const isValid = await bcrypt.compare(oldPassword, user.password);
                if (!isValid) {
                    ThrowError('#Invalid old password');
                }
    
                const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
                await DBObject.updateOne('users', { password: hashedPassword }, { id: context.id });
    
                SaveAuditTrail({
                    user_id: context.id,
                    email: context.email,
                    company_id: 0,
                    branch_id: 0,
                    task: 'CHANGE_PASSWORD',
                    details: 'User changed their password',
                    ip_address: context.ip,
                    browser_agents: context.userAgent,
                });
    
                return 1;
            },
    
            async verifyEmail(_, { token, email }, context) {
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
    
            async updateFirebaseToken(_, { token }, context) {
                if (!context.id) {
                    ThrowError("#RELOGIN");
                  }
    
                if (!Validate.string(token)) {
                    ThrowError("#Invalid token");
                }
    
                await DBObject.updateOne('users', { firebase_token: token }, { id: context.id });
    
                SaveAuditTrail({
                    user_id: context.id,
                    email: context.email,
                    company_id: 0,
                    branch_id: 0,
                    task: 'UPDATE_FIREBASE_TOKEN',
                    details: 'User updated their Firebase token',
                    ip_address: context.ip,
                    browser_agents: context.userAgent,
                });
    
                return 1;
            },
    
            async updateUserSettings(_, { settings }, context) {
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
                    details: 'User updated their settings',
                    ip_address: context.ip,
                    browser_agents: context.userAgent,
                });
    
                return settings;
            }
        },
    
        Query: {
            async currentUser(_, __, context) {
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

            getConfig: async (_, __, context) => {
                if (!context.id) {
                  ThrowError("#RELOGIN");
                }
          
                return CONFIG;
              },
  
        }
    };