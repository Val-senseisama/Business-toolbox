import "dotenv/config";
import * as mysql from 'mysql2/promise';
import { ThrowError } from "./Helpers.js";

let _DB: any;

export const DBConnect = async () => {
	try {
		_DB = mysql.createPool({
			host: process.env.DB_HOST,
			port: +process.env.DB_PORT,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_DATABASE,
			namedPlaceholders: true,
			waitForConnections: true,
			connectionLimit: 30,
			maxIdle: 5,
			idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
			queueLimit: 0,
			enableKeepAlive: true,
			keepAliveInitialDelay: 0,
			dateStrings: true,
		});

		const connection = await _DB.getConnection();
		connection.release();

		console.log("New MySQL Connection pool created successfully.");
	} catch (error) {
		console.log("New MySQL Database connection failed.");
		throw error;
	}
};


type OptionType = {
	useIndex?: string;
	columns?: string;
};


export const DBObject = {

	async transaction(): Promise<void> {

		const query = "START TRANSACTION";

		await _DB.query(query);
	},

	// Method to commit a transaction
	async commit(): Promise<void> {
		// Create a query to commit the transaction
		const query = "COMMIT";
		// Execute the query and store the results in an array
		await _DB.query(query);
	},

	// Method to rollback a transaction
	async rollback(): Promise<void> {
		// Create a query to rollback the transaction
		const query = "ROLLBACK";
		// Execute the query and store the results in an array
		await _DB.query(query);
	},

	// Method to select multiple rows from the database directly with query
	async query(sql = ""): Promise<any> {
		if (sql === "") {
			ThrowError("Query is empty");
		}
		// Execute the query and store the results in an array
		try {
			// eslint-disable-next-line no-unused-vars
			const [results, fields] = await _DB.query(sql);
			// Return an object with the error and data (the row)

			return results;
		} catch (err) {
			ThrowError("Query Error.");
		}
	},

	// Method to insert one row into the database
	async insertOne(tableName: string, data: Record<string, any>): Promise<number> {
		const columns = "`" + Object.keys(data).join("`,`") + "`";
		const placeholders = Object.keys(data)
			.map((col) => {
				return ":" + col;
			})
			.join(",");
		// Create a query to insert into the table
		const query = `INSERT INTO ${tableName} (${columns}) VALUES ( ${placeholders})`;
		// eslint-disable-next-line no-unused-vars
		const [result, error] = await _DB.execute(query, data);

		// Return the id of the updated row
		return result.insertId;
	},

	// Method to insert multiple rows into the database
	async insertMany(tableName: string, data: Record<string, any>[]): Promise<number> {
		const columns = "`" + Object.keys(data[0]).join("`,`") + "`";
		const values = [];
		// Loop through the data array
		for (let i = 0; i < data.length; i++) {
			const row = [];
			Object.keys(data[0]).forEach((col) => {
				row.push(data[i][col]);
			});
			values.push(row);
		}
		// Create a query to insert multiple rows into the table
		const query = `INSERT INTO ${tableName} (${columns}) VALUES ?;`;
		// Execute the query and store the results in an array
		const result = await _DB.query(query, [values], true);
		// Return an object with the error and data (the number of affected rows)
		return result[0].affectedRows;
	},

	// Method to update one row in the database
	async updateOne(tableName: string, data: Record<string, any>, condition: Record<string, any>): Promise<number> {
		const set = Object.keys(data)
			.map((col) => {
				return "`" + col + "` = :" + col;
			})
			.join(", ");
		const allData = { ...data };
		let query = "";
		if (condition && Object.keys(condition)?.length > 0) {
			const where = Object.keys(condition)
				.map((col) => {
					allData["w_" + col] = condition[col];
					return col + " = :w_" + col;
				})
				.join(" AND ");
			// Create a query to update one row in the table
			query = `UPDATE ${tableName} SET ${set} WHERE ${where} LIMIT 1`;
		} else query = `UPDATE ${tableName} SET ${set} LIMIT 1`;

		// Execute the query and store the results in an array
		const result = await _DB.execute(query, allData);
		// Return an object with the error and data (the number of changed rows)
		return result[0].affectedRows;
	},

	// Method to update multiple rows in the database
	async updateMany(
		tableName: string,
		data: Record<string, any>[],
		condition: Record<string, any>
	): Promise<number> {
		const set = Object.keys(data)
			.map((col) => {
				return "`" + col + "` = :" + col;
			})
			.join(", ");
		const allData = { ...data };
		let query = "";
		if (condition && Object.keys(condition)?.length > 0) {
			const where = Object.keys(condition)
				.map((col) => {
					allData["w_" + col] = condition[col];
					return col + " = :w_" + col;
				})
				.join(" AND ");

			// Create a query to update multiple rows in the table
			query = `UPDATE ${tableName} SET ${set} WHERE ${where}`;
		} else query = `UPDATE ${tableName} SET ${set}`;
		// Execute the query and store the results in an array

		// Execute the query and store the results in an array
		const result = await _DB.execute(query, allData);
		// Return an object with the error and data (the number of changed rows)
		return result[0].affectedRows;
	},

	async updateDirect(query: string, params?: Record<string, any>): Promise<number> {
		// Execute the query and store the results in an array
		const result = await _DB.execute(query, params);
		// Return an object with the error and data (the number of changed rows)
		return result[0].affectedRows;
	},

	// Method to delete one row from the database
	async deleteOne(tableName: string, condition: Record<string, any>): Promise<number> {
		// Create a query to delete one row from the table
		let query = "";
		if (condition && Object.keys(condition)?.length > 0) {
			const where = Object.keys(condition)
				.map((col) => {
					return "`" + col + "` = :" + col;
				})
				.join(" AND ");
			query = `DELETE FROM ${tableName} WHERE ${where} LIMIT 1`;
		} else query = `DELETE FROM ${tableName} LIMIT 1`;
		// Execute the query and store the results in an array
		const result = await _DB.execute(query, condition);
		// Return an object with the error and data (the number of affected rows)
		return result[0].affectedRows;
	},

	// Method to delete multiple rows from the database
	async deleteMany(tableName: string, condition: Record<string, any>): Promise<number> {
		// Create a query to delete one row from the table
		let query = "";
		if (condition && Object.keys(condition)?.length > 0) {
			const where = Object.keys(condition)
				.map((col) => {
					return "`" + col + "` = :" + col;
				})
				.join(" AND ");
			query = `DELETE FROM ${tableName} WHERE ${where}`;
		} else query = `DELETE FROM ${tableName}`;
		// Execute the query and store the results in an array
		const result = await _DB.execute(query, condition);
		// Return an object with the error and data (the number of affected rows)
		return result[0].affectedRows;
	},

	// Method to delete multiple rows from the database
	async deleteDirect(query: string, condition?: Record<string, any>): Promise<number> {
		if (condition && Object.keys(condition)?.length > 0) {
			const result = await _DB.execute(query, condition);
			return result[0].affectedRows;
		} else {
			const result = await _DB.execute(query);
			return result[0].affectedRows;
		}
	},

	// Method to select one row from the database
	async findOne(
		tableName: string,
		condition?: Record<string, any>,
		options?: OptionType
	): Promise<Record<string, any> | null> {
		let columns = "*";
		if (options?.columns && options.columns.length > 0) {
			columns = options.columns;
		}
		if (condition && Object.keys(condition)?.length > 0) {
			let myIndex = "";
			if (options?.useIndex && options.useIndex.length > 1) {
				myIndex = ` USE INDEX (${options.useIndex}) `;
			}
			const placeholders = Object.keys(condition)
				.map((col) => {
					return "`" + col + "` = :" + col;
				})
				.join(" AND ");
			// Create a query to select one row from the table
			const query = `SELECT ${columns} FROM ${tableName} ${myIndex} WHERE ${placeholders} LIMIT 1`;
			// Execute the query and store the results in an array
			const result = await _DB.execute(query, condition);
			// Return an object with the and data (the row)
			return result[0][0];
		} else {
			// Create a query to select one row from the table
			const query = `SELECT  ${columns} FROM ${tableName} LIMIT 1`;
			// Execute the query and store the results in an array
			const result = await _DB.execute(query);
			// Return an object with the and data (the row)
			return result[0][0];
		}
	},

	// Method to select multiple rows from the database
	async findMany(
		tableName: string,
		condition?: Record<string, any>,
		options?: OptionType
	): Promise<Record<string, any>[]> {
		let columns = "*";
		if (options?.columns && options.columns.length > 0) {
			columns = options.columns;
		}

		if (condition && Object.keys(condition)?.length > 0) {
			let myIndex = "";
			if (options?.useIndex && options.useIndex.length > 1) {
				myIndex = ` USE INDEX (${options.useIndex}) `;
			}

			const placeholders = Object.keys(condition)
				.map((col) => {
					return "`" + col + "` = :" + col;
				})
				.join(" AND ");
			// Create a query to select multiple rows from the table
			const query = `SELECT ${columns} FROM ${tableName} ${myIndex} WHERE ${placeholders}`;
			// Execute the query and store the results in an array
			const result = await _DB.execute(query, condition);
			// Return an object with the error and data (the row)
			return result[0];
		} else {
			const query = `SELECT ${columns} FROM ${tableName}`;
			// Execute the query and store the results in an array
			const result = await _DB.execute(query);
			// Return an object with the error and data (the row)
			return result[0];
		}
	},

	// Method to select multiple rows from the database
	async findDirect(query: string, condition?: Record<string, any>): Promise<Record<string, any>[]> {
		if (condition && Object.keys(condition)?.length > 0) {
			// Execute the query and store the results in an array
			let result;
			result = await _DB.execute(query, condition);

			// Return an object with the error and data (the row)
			return result[0];
		} else {
			// Execute the query and store the results in an array
			const result = await _DB.execute(query);
			// Return an object with the error and data (the row)
			return result[0];
		}
	},

	async upsertOne(tableName: string, data: Record<string, any>): Promise<number> {
		const columns = "`" + Object.keys(data).join("`,`") + "`";
		const placeholders = Object.keys(data)
			.map((col) => {
				return ":" + col;
			})
			.join(",");
		// Create a query to insert into the table
		const query = `REPLACE INTO ${tableName} (${columns}) VALUES ( ${placeholders})`;
		const [result] = await _DB.execute(query, data);

		// Return an object with the error and data (the insert ID)
		return result.affectedRows;
	},

	// Method to insert multiple rows into the database
	async upsertMany(tableName: string, data: Record<string, any>[]): Promise<number> {
		const columns = "`" + Object.keys(data[0]).join("`,`") + "`";
		const values = [];
		// Loop through the data array
		for (let i = 0; i < data.length; i++) {
			const row = [];
			Object.keys(data[0]).forEach((col) => {
				row.push(data[i][col]);
			});
			values.push(row);
		}
		// Create a query to insert multiple rows into the table
		const query = `REPLACE INTO ${tableName} (${columns}) VALUES ?;`;
		// Execute the query and store the results in an array
		const result = await _DB.query(query, [values], true);
		// Return an object with the error and data (the number of affected rows)
		return result[0].affectedRows;
	},

	async insertIgnoreOne(tableName: string, data: Record<string, any>): Promise<number> {
		const columns = "`" + Object.keys(data).join("`,`") + "`";
		const placeholders = Object.keys(data)
			.map((col) => {
				return ":" + col;
			})
			.join(",");
		// Create a query to insert into the table
		const query = `INSERT IGNORE INTO ${tableName} (${columns}) VALUES ( ${placeholders})`;
		const [result] = await _DB.execute(query, data);

		// Return an object with the error and data (the insert ID)
		return result.affectedRows;
	},

	// Method to insert multiple rows into the database
	async insertIgnoreMany(tableName: string, data: Record<string, any>[]): Promise<number> {
		const columns = "`" + Object.keys(data[0]).join("`,`") + "`";
		const values = [];
		// Loop through the data array
		for (let i = 0; i < data.length; i++) {
			const row = [];
			Object.keys(data[0]).forEach((col) => {
				row.push(data[i][col]);
			});
			values.push(row);
		}
		// Create a query to insert multiple rows into the table
		const query = `INSERT IGNORE INTO ${tableName} (${columns}) VALUES ?;`;
		// Execute the query and store the results in an array
		const result = await _DB.query(query, [values], true);
		// Return an object with the error and data (the number of affected rows)
		return result[0].affectedRows;
	},

	async executeDirect(query: string): Promise<any> {
		return await _DB.execute(query);
	},
};