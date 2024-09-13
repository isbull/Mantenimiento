import dotenv from "dotenv";
dotenv.config();
const { db_host, db_user, db_password, db_name, port } = process.env;

export { db_host, db_user, db_password, db_name, port };
