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
		UPCOMING_BIRTHDAYS_DAYS_AHEAD: 7,
		SUBSCRIPTION_REMINDER_DAYS: [10, 5, 1, 0, -1, -2, -5, -10, -30, -60, -90, -120, -150, -180, -210, -240, -270, -300],
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
