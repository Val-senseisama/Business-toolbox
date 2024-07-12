export type ObjectType = {
	[index: string]: any;
};

export type AuditTrailType = {
	user_id: number,
	email: string,
	action: string,
	description: string,
	old_values?: string,
	new_values?: string,
	ip_address?: string,
	user_agent?: string,
	created_at?: string,
}