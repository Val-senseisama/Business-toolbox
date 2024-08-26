import { fileURLToPath } from "url";
import path from "path";
import { ModelType } from "../Helpers/types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG = {
	BASE: __dirname + "/../",
	settings: {
		PUBLIC_SHORT_FILE_PATH: __dirname + "/",
		PUBLIC_SHORT_URL_PATH: "https://cdn.syllabux.cyou/",
		CHROMA_SERVER: "http://localhost:2910",
		SAVE_LOG_INTERVAL: 5, // minutes
		MAX_LOG_STACK: 10,
		PAGINATION_LIMIT: 30,
		PASSWORD_RESET_TOKEN_VALIDITY_MINUTES: 30,
		UPCOMING_BIRTHDAYS_DAYS_AHEAD: 7,
		REMEMBER_ME_DAYS: 180,//No of days to remain logged in on a device after last visit
		RECONFIRM_DEVICE_MINUTES: 5,
		FALLBACK_ACCESS_SECRET: '6337d2ee-f855-4c74-8e28-f936bd1f330c-b9489edc-9e37-4b17-b8bd-50e2e1b2ab09',
		FALLBACK_REFRESH_SECRET: '773ef421-8f25-4da6-a760-923d78a805b7-67d586b9-4379-45d7-82fa-3b204fcc0e6d',
		SUBSCRIPTION_REMINDER_DAYS: [10, 5, 1, 0, -1, -2, -5, -10, -30, -60, -90, -120, -150, -180, -210, -240, -270, -300]
	},
	client: {
		cdn: "http://localhost:4022/",

	},
	permissions: {
		"roles": "Manage user roles",
		"manage_users": "Manage company users.",
		"manage_company": "Manage company info, settings, branches.",
		"manage_hr": "Manage Employees.",
		"manage_attendance": "Manage Attendance.",

	},
	models: [
		{
			model: 'embed',
			embedding: true,
			baseURL: 'https://openai.syllabux.app/v1',
			apiKey: 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
			max_tokens: 32000
		},
		{
			model: 'aggregator',
			aggregator: true,
			baseURL: 'https://openai.syllabux.app/v1',
			apiKey: 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
			max_tokens: 32000
		},
		{
			model: 'proposer1',
			proposer: true,
			baseURL: 'https://openai.syllabux.app/v1',
			apiKey: 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
			max_tokens: 32000
		},
		{
			model: 'proposer2',
			proposer: true,
			baseURL: 'https://openai.syllabux.app/v1',
			apiKey: 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
			max_tokens: 32000
		},
		{
			model: 'vision',
			vision: true,
			baseURL: 'https://openai.syllabux.app/v1',
			apiKey: 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
			max_tokens: 32000
		},
		{
			model: 'dall-e-3',
			image: true,
			baseURL: 'https://openai.syllabux.app/v1',
			apiKey: 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
		},
		{
			model: 'educator_marcus',
			speech: true,
			textbook: true,
			baseURL: 'https://openai.syllabux.app/v1',
			apiKey: 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
		},
		{
			model: 'storybook_esther',
			speech: true,
			storybook: true,
			baseURL: 'https://openai.syllabux.app/v1',
			apiKey: 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
		}
	] as ModelType[],
};

export default CONFIG;
