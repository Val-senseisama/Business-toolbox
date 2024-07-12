// module `set-tokens`
import jwt from "jsonwebtoken";
import "dotenv/config";
import { ThrowError, uuid } from "./Helpers.js";
import { DBObject } from "./MySQL.js";

const setJWT = async (userID: number) => {
	// const mainDB = DBObject;// DB("main");
	const daysWithoutUsageBeforeLoggedOut = 30; //No of days to remain logged in on a device after last visit
	const minutesToReconfirmIdentity = 60; //No of minutes before their identity is reconfirmed. adjusted to 65 minutes

	
	const oldUser = await DBObject.findOne("admins", { id: userID });
    if (!oldUser) {
        ThrowError("User token error.");
    }
	if (oldUser.roleID <= 0) {
		return { accessToken: "", refreshToken: "", user: oldUser };
	}
	const thisRole = await DBObject.findOne("roles", { id: oldUser.role_id });
	let adminRoles = [];
	try {
		adminRoles = JSON.parse(thisRole.json);
	} catch (error) {
		adminRoles = [];
	}

 

	// create jwt
	const accessToken = jwt.sign(
		{
			id: oldUser.id,
			name: `${oldUser.title} ${oldUser.lastname} ${oldUser.firstname}`,
			roles: adminRoles,
		},

		process.env.ACCESS_TOKEN_SECRET,
		{
			expiresIn: minutesToReconfirmIdentity * 60 * 1000,
		}
	);

	// Create refresh token
	const jwt_refresh_count = uuid();

	await DBObject.updateOne("users", { jwt_refresh_count }, { id: userID });

	const refresholdUser = {
		id: oldUser.id,
		count: jwt_refresh_count,
	};
	const refreshToken = jwt.sign(
		refresholdUser,

		process.env.REFRESH_TOKEN_SECRET,
		{
			expiresIn: daysWithoutUsageBeforeLoggedOut * 60 * 60 * 24 * 1000,
		}
	);

	return { adminAccessToken: accessToken, adminRefreshToken: refreshToken, user: oldUser };
};

export default setJWT;


