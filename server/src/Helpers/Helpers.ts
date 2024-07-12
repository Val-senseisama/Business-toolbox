import { GraphQLError } from "graphql";
import fs from "fs";
import { DateTime } from "luxon";
import { DBObject } from "./MySQL.js";
import _CONFIG from "../config/config.js";
import { AuditTrailType } from "./types.js";

const imageDir = _CONFIG.settings.PUBLIC_SHORT_FILE_PATH;
const logIntervalMinutes: number = 5;
let memoryCache: any[] = [];
let logCache: string[] = [];
let pendingAuditTrails: AuditTrailType[] = [];
const logFile = "syllabux_logs_" + DateTime.local().toISODate() + ".txt";

setInterval(() => {
	commitMemory();
}, logIntervalMinutes * 60 * 1000);

export const log = async (msg: any) => {
	logCache.push(
		DateTime.local().toISOTime() + ": " + JSON.stringify(msg, null, 2)
	);
	if (logCache.length > 30) {
		commitMemory();
	}
};

function commitMemory() {
	if (pendingAuditTrails.length > 0) {
		const auditTrails = pendingAuditTrails;
		pendingAuditTrails = [];
		DBObject.insertOne('audit_trail', auditTrails).catch(err => log(err));
	}

	if (logCache.length == 0) return;
	const str = logCache.join("\n\n") + "\n\n";
	logCache = [];
	try {
		fs.appendFileSync(logFile, str);
	} catch (err) {
		/** */
	}
}

export const findFromMemory = async ({ query, table, hours = 24 }) => {
	// remove expired elements from cache
	memoryCache = memoryCache.filter(
		(element) => DateTime.now().toSeconds() > element.time
	);

	const element = memoryCache.find((element) => element.key == query);
	if (element && element.data) {
		return element.data;
	} else {
		try {
			const data = await DBObject.findDirect(query);
			memoryCache.push({
				key: query,
				table,
				data,
				time: DateTime.now().toSeconds() + hours * 60 * 60,
			});
			return data;
		} catch (err) {
			log(err);
			return [];
		}
	}
};

export const resetMemory = (table: string = "") => {
	if (!table) {
		memoryCache = [];
		return;
	}
	memoryCache = memoryCache.filter(
		(element) =>
			DateTime.now().toSeconds() > element.time && element.table != table
	);
	return;
};

export const ThrowError = (message: string) => {
	throw new GraphQLError(message, {
		extensions: { code: "USER" },
	});
};

export const HasStudentPermission = (data: {
	studentID: number;
	context: any;
	schoolID: number;
}) => {
	const { studentID, context, schoolID } = data;
	if (
		!context ||
		!context.id ||
		!context.code ||
		!schoolID ||
		!studentID ||
		studentID != context.id
	) {
		return false;
	}

	const parts = context.code.split("-");
	if (parts.length !== 3 || schoolID != +parts[1] || studentID != +parts[2]) {
		return false;
	}
	return true;
};

export const HasParentPermission = (data: {
	studentID: number;
	context: any;
	schoolID: number;
}) => {
	const { studentID, context, schoolID } = data;
	if (
		!context ||
		!context.id ||
		!context.children ||
		context.children.length == 0 ||
		!context.children?.includes(studentID)
	) {
		return false;
	}
	return true;
};

export const HasSchoolPermission = (data: {
	task: string;
	schoolID: number;
	context: any;
}): boolean => {
	const { task, schoolID, context } = data;
	if (!context || context.id < 1 || !schoolID || !context.roles["" + schoolID])
		return false;
	if (context.roles["" + schoolID] == "OWNER") return true;
	if (context.roles["" + schoolID].length > 0 && task == "ANY") return true;
	let allowed = false;
	context.roles["" + schoolID].map((obj: string) => {
		if (obj === task) allowed = true;
	});
	return allowed;
};

export const HasAdminPermission = (data: {
	roleName: string;
	context: any;
}): boolean => {
	const { roleName, context } = data;
	return context.ar?.includes(roleName);
};

export const MakeID = (length: number) => {
	var result = "";
	var characters = "ABCDEFGHJKLMNPQRTUVWXY346789";
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
};

// create a function to generate uuid v4
export const uuid = () => {
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
		var r = (Math.random() * 16) | 0,
			v = c == "x" ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
};

export const base64ToFile = (str: string, schoolID: number) => {
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
			log(`Error creating directory ${imageDir + schoolIDx}.`);
		}
	}

	try {
		fs.writeFileSync(imageDir + schoolIDx + path, base64Image, {
			encoding: "base64",
		});
	} catch (err) {
		log(err);
		ThrowError("An error occured while trying to save image.");
	}

	return schoolIDx + path;
};

export const saveFirebaseMessage = async (
	studentIDs: number[],
	topic: string,
	message: string
) => {
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
		log(error);
	}
};


export const SaveAuditTrail = async (data: AuditTrailType) => {
	data.old_values || (data.old_values = "");
	data.new_values || (data.new_values = "");
	data.ip_address || (data.ip_address = "");
	data.user_agent || (data.user_agent = "");
	data.created_at = DateTime.now().toSQL();

	pendingAuditTrails.push(data);
	if (pendingAuditTrails.length > 30) {
		const auditTrails = pendingAuditTrails;
		pendingAuditTrails = [];
		DBObject.insertOne('audit_trail', auditTrails).catch(err => log(err));
	}
};