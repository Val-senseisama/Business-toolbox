import jwt from "jsonwebtoken";
import "dotenv/config";
import setJWT from "../Helpers/setJWT.js";
import { ThrowError } from "../Helpers/Helpers.js";
import { DBObject } from "../Helpers/MySQL.js";
import { ObjectType } from "../Helpers/types.js";

function validateAccessToken(token: string) {
	try {
		// eslint-disable-next-line no-undef
		return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
	} catch {
		return null;
	}
}

function validateRefreshToken(token: string) {
	try {
		// eslint-disable-next-line no-undef
		return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
	} catch {
		return null;
	}
}

export default async (req: any, res: any) => {
	// Get all the headers from this request
	const refreshToken = req.headers["x-refresh-token"];
	const accessToken = req.headers["x-access-token"];

	//Process as standard user
	if (
		!accessToken &&
		!refreshToken
	) {
		return null;
	}

	const forceRefresh = req.headers["x-force-refresh"];


	// if the access token is still valid and we are not trying to forcefully refresh
	const decodedAccessToken: any = validateAccessToken(accessToken);
	if (!forceRefresh && decodedAccessToken && decodedAccessToken.id) {
		return decodedAccessToken;
	}

	// if we are focing refresh of access token
	// or the access token in no more valid
	// check if refresh token is still valid
	const decodedRefreshToken: any = validateRefreshToken(refreshToken);
	// Is the refresh token still valid
	if (decodedRefreshToken && decodedRefreshToken.id) {
		// The refresh token is valid. Validate the refresh token against the database
		const thisUser = await DBObject.findOne("users", {
			id: decodedRefreshToken.id,
		});

		if (
			!decodedRefreshToken.count ||
			decodedRefreshToken.count != thisUser.jwt_refresh_count
		) {
			ThrowError("Session expired. Please login again.");
		}
		const userTokens = await setJWT(decodedRefreshToken.id);

		res.set({
			"Access-Control-Expose-Headers": "x-access-token,x-refresh-token",
			"x-access-token": userTokens.accessToken,
			"x-refresh-token": userTokens.refreshToken,
		});
		return userTokens.user;
	}

	return null;
};
