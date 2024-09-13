import mysql from "mysql2/promise";
import { db_host, db_user, db_password, db_name, port } from "../env.js";

const pool = mysql.createPool({
  host: db_host,
  user: db_user,
  password: db_password,
  database: db_name,
  port: port,
});

export default pool;
