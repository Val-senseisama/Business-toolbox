import { GraphQLError } from "graphql";
import fs from "fs";
import { DateTime } from "luxon";
import { DBObject } from "./MySQL.js";
import _CONFIG from "../config/config.js";
import { AuditTrailType, LogType } from "./types.js";
import CONFIG from "../config/config.js";

const imageDir = _CONFIG.settings.PUBLIC_SHORT_FILE_PATH;
let logCache: LogType[] = [];
let pendingAuditTrails: AuditTrailType[] = [];

setInterval(() => {
	commitMemory();
}, CONFIG.settings.SAVE_LOG_INTERVAL * 60 * 1000);

export const log = async (task = 'LOG', msg: any): Promise<void> => {
	if (typeof msg != "string") msg = JSON.stringify(msg, null, 2);
	logCache.push({ created_at: DateTime.local().toISOTime(), task, message: msg });
	if (logCache.length > CONFIG.settings.MAX_LOG_STACK) {
		commitMemory();
	}
};

function commitMemory(): void {
	if (pendingAuditTrails.length > 0) {
		const auditTrails = pendingAuditTrails;
		pendingAuditTrails = [];
		DBObject.insertOne('audit_trail', auditTrails).catch(() => {
			/** */
		});
	}

	/* if (logCache.length == 0) return;
	const data = logCache;
	logCache = [];
	DBObject.insertMany("logs", data)
		.catch(err => console.log(err)); */
}


export const ThrowError = (message: string): never => {
	throw new GraphQLError(message, {
		extensions: { code: "USER" },
	});
};


export const MakeID = (length: number): string => {
	var result = "";
	var characters = "ABCDEFGHJKLMNPQRTUVWXY346789";
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
};

// create a function to generate uuid v4
export const uuid = (): string => {
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
		var r = (Math.random() * 16) | 0,
			v = c == "x" ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
};

export const base64ToFile = (str: string, schoolID: number): string => {
	if (!str) return "";
	if (!str.includes(";base64,")) return str;
	const b64Parts = str.split(";base64,");
	const ext = b64Parts[0].split("/")[1];
	let base64Image = b64Parts[1];

	const path = uuid() + "." + ext;
	let schoolIDx = "" + schoolID;
	if (!schoolIDx.includes("/")) schoolIDx = schoolID + "/";

	if (!fs.existsSync(imageDir + schoolIDx)) {
		try {
			fs.mkdirSync(imageDir + schoolIDx, { recursive: true });
		} catch (err) {
			log('base64ToFile', err);
		}
	}

	try {
		fs.writeFileSync(imageDir + schoolIDx + path, base64Image, {
			encoding: "base64",
		});
	} catch (err) {
		log('base64ToFile', err);
		ThrowError("An error occured while trying to save image.");
	}

	return schoolIDx + path;
};

export const saveFirebaseMessage = async (
	studentIDs: number[],
	topic: string,
	message: string
): Promise<void> => {
	if (studentIDs.length < 1) return;
	try {
		let parents = await DBObject.findDirect(
			"Select userID FROM school_users WHERE studentID IN (" +
			studentIDs.join(",") +
			")"
		);
		parents = parents.map((p) => p.userID);
		if (parents.length < 1) return;

		let firebase = await DBObject.findDirect(
			"SELECT firebase from users WHERE id IN (" + parents.join(",") + ")"
		);
		firebase = firebase.filter((f) => f.firebase).map((f) => f.firebase);
		if (firebase.length < 1) return;

		const codes = firebase.map((f) => {
			return { code: f, message, topic };
		});

		if (codes.length > 0) {
			await DBObject.insertMany("firebase", codes);
		}
	} catch (error) {
		log('saveFirebaseMessage', error);
	}
};


export const SaveAuditTrail = async (data: AuditTrailType): Promise<void> => {
	// Set default values for optional properties
	data.ip_address = data.ip_address || "";
	data.created_at = data.created_at || DateTime.now().toSQL();

	// Remove properties that are no longer part of AuditTrailType
	const {
		user_id,
		name,
		company_id,
		branch_id,
		browser_agents,
		task,
		details,
		ip_address,
		created_at
	} = data;

	const auditTrailData = {
		user_id,
		name,
		company_id,
		branch_id,
		browser_agents,
		task,
		details,
		ip_address,
		created_at
	};

	pendingAuditTrails.push(auditTrailData);
	if (pendingAuditTrails.length > CONFIG.settings.MAX_LOG_STACK) {
		await commitMemory();
	}
};