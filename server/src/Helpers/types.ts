export type ObjectType = {
	[index: string]: any;
};

export type AuditTrailType = {
	user_id: number,
	email: string,
	company_id:number,
	branch_id:number,
	browser_agents:string,
	task:string,
	details:any,
	ip_address?: string,
	created_at?: string,

}

export type ModelType = {
	model: string,
	aggregator?: boolean,
	embedding?: boolean,
	proposer?: boolean,
	vision?: boolean,
	image?: boolean,
	speech?: boolean,
	textbook?: boolean,
	storybook?: boolean,
	baseURL: string,
	apiKey: string,
	max_tokens: number,

}

export type LogType = {
	task?: string,
	message: string,
	created_at?: string
}