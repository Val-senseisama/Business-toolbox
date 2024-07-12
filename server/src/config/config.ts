import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename);

const _CONFIG = {
	BASE: __dirname + "/../",
	settings: {
		PUBLIC_SHORT_FILE_PATH: __dirname + "/../httpdocs/appz.com.ng/",
		PUBLIC_SHORT_URL_PATH: "https://cdn.syllabux.cyou/",
		CHROMA_SERVER: "http://localhost:2910",
		PAGINATION_LIMIT: 30,
		UPCOMING_BIRTHDAYS_DAYS_AHEAD: 7,
		SUBSCRIPTION_REMINDER_DAYS: [10, 5, 1, 0, -1, -2, -5, -10, -30, -60, -90, -120, -150, -180, -210, -240, -270, -300],
	},
	models: [
		{
			name: "embed",
			enabled: true,
			embedding: true,
			baseURL: "https://api.endpoints.anyscale.com/v1",
			apiKey: "ollama",
			max_tokens: 10000,
			model: "embed"
		},

	]
};

export default _CONFIG;
