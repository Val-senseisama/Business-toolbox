// module `set-tokens`
import jwt from "jsonwebtoken";
import "dotenv/config";
import { log, ThrowError, uuid } from "./Helpers.js";
import { DBObject } from "./MySQL.js";
import CONFIG from "../config/config.js";

const setJWT = async (userID: number) => {

	const oldUser = await DBObject.findOne("users", { id: userID });
	if (!oldUser || !oldUser.id) {
		ThrowError("Invalid user error.");
		return;
	}

	let STAFF: Record<number, any> = {};
	let CUSTOMERS = [];
	const company_users = await DBObject.findMany('user_company', { user_id: oldUser.id, status: 'ACTIVE' });
	for (const element of company_users) {
		if (element.user_id != oldUser.id) continue;

		if (element.role_type == 'CUSTOMER') {
			CUSTOMERS.push(element.company_id);
			continue;
		}

		if (element.role_type == 'OWNER') {
			STAFF[element.company_id] = 'OWNER';
			continue;
		}

		const role_id = element.role_id;

		const role = await DBObject.findOne('roles', { id: element.role_id, status: 'ACTIVE' }, { columns: 'json' });
		if (!role || !role.json) continue;
		let json;
		if (typeof role.json === 'string') json = JSON.parse(role.json);
		else json = role.json;

		STAFF[element.company_id] = json;
	}


	// create jwt
	const accessToken = jwt.sign(
		{
			id: oldUser.id,
			name: `${oldUser.title} ${oldUser.firstname} ${oldUser.lastname}`,
			email: `${oldUser.email}`,
			customer: CUSTOMERS,
			staff: STAFF
		},
		process.env.ACCESS_TOKEN_SECRET || CONFIG.settings.FALLBACK_ACCESS_SECRET,
		{
			expiresIn: CONFIG.settings.RECONFIRM_DEVICE_MINUTES * 60 * 1000,
		}
	);

	// Create refresh token
	const refresh_secret = uuid();

	DBObject.updateOne("users", { refresh_secret }, { id: oldUser.id })
		.catch((error) => {
			log('setJWT', error);
		});

	const refresholdUser = {
		id: oldUser.id,
		refresh_secret,
	};
	const refreshToken = jwt.sign(
		refresholdUser,
		process.env.REFRESH_TOKEN_SECRET || CONFIG.settings.FALLBACK_REFRESH_SECRET,
		{ expiresIn: CONFIG.settings.REMEMBER_ME_DAYS * 24 * 60 * 60 * 1000 }
	);

	return { accessToken, refreshToken, user: oldUser };
};

export default setJWT;


