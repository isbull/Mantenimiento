import { getPool } from "./getPool.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

const main = async () => {
  let pool;
  try {
    pool = await getPool();
    console.log("Borrando tablas...");

    await pool.query("SET FOREIGN_KEY_CHECKS = 0");

    await pool.query(
      "DROP TABLE IF EXISTS users, coches, ficha_tecnica_coches, mantenimiento_periodico"
    );

    await pool.query("SET FOREIGN_KEY_CHECKS = 1");
    console.log("Creando tablas...");

    await pool.query(`CREATE TABLE IF NOT EXISTS users(
      id INT(11) NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    coche VARCHAR(100) NOT NULL,
    matricula VARCHAR(10) NOT NULL UNIQUE PRIMARY KEY,
    role ENUM('admin', 'cliente') DEFAULT 'cliente',
    registrationCode CHAR(30),
    recoverPassCode CHAR(10),
    telefono VARCHAR(20) NOT NULL,
    
    direccion VARCHAR(100) NOT NULL
    )`);

    await pool.query(`CREATE TABLE IF NOT EXISTS coches(
      id INT NOT NULL AUTO_INCREMENT,
      matricula VARCHAR(10) NOT NULL UNIQUE,
      marca VARCHAR(20) NOT NULL,
      modelo VARCHAR(30) NOT NULL,
      plazas INT(10),
      kilometros INT(100) NOT NULL,
      itv BOOLEAN NOT NULL,
      itv_fecha DATE NOT NULL,
      ultimo_mantenimiento DATE NOT NULL,
      PRIMARY KEY (id),
      FOREIGN KEY (matricula) REFERENCES users(matricula)
    )`);

    await pool.query(`CREATE TABLE IF NOT EXISTS ficha_tecnica_coches (
      matricula VARCHAR(10) PRIMARY KEY NOT NULL UNIQUE,
      marca VARCHAR(50) NOT NULL,
      modelo VARCHAR(50) NOT NULL,
      tamaño_ruedas VARCHAR(11) NOT NULL,
      motor VARCHAR(100) NOT NULL,
      combustible VARCHAR(30) NOT NULL,
      bateria VARCHAR(100) NOT NULL,
      caballaje VARCHAR(20) NOT NULL,
      tipo_aceite VARCHAR(100) NOT NULL,
      filtro_aceite VARCHAR(100) NOT NULL,
      filtro_aire VARCHAR(100) NOT NULL,
      filtro_gasolina VARCHAR(100) NOT NULL,
      filtro_aceite_diferencial VARCHAR(100) NOT NULL,
      filtro_aceite_transmision VARCHAR(100) NOT NULL,
      filtro_aceite_direccion VARCHAR(100) NOT NULL,
      bujias VARCHAR(100) NOT NULL,
      bandas VARCHAR(100) NOT NULL,
      pastillas_frenos VARCHAR(100) NOT NULL,
      cigueñales VARCHAR(100) NOT NULL,
      arbol_levas VARCHAR(100) NOT NULL,
      FOREIGN KEY (matricula) REFERENCES users(matricula)
    )`);

    await pool.query(`CREATE TABLE IF NOT EXISTS mantenimiento_periodico (
      matricula VARCHAR(10) PRIMARY KEY NOT NULL UNIQUE,
      fecha_cambio_aceite DATE NOT NULL,
      fecha_cambio_filtro_aire DATE NOT NULL,
      fecha_cambio_filtro_gasolina DATE NOT NULL,
      fecha_cambio_filtro_aceite DATE NOT NULL,
      fecha_cambio_filtro_aceite_diferencial DATE NOT NULL,
      fecha_cambio_filtro_aceite_transmision DATE NOT NULL,
      fecha_cambio_filtro_aceite_direccion DATE NOT NULL,
      fecha_cambio_bujias DATE NOT NULL,
      fecha_cambio_bandas DATE NOT NULL,
      fecha_cambio_pastillas_frenos DATE NOT NULL,
      fecha_cambio_cigueñales DATE NOT NULL,
      fecha_cambio_arbol_levas DATE NOT NULL,
      FOREIGN KEY (matricula) REFERENCES users(matricula)
    )`);

    console.log("Insertando datos de prueba...");

    try {
      const queries = [
        "DROP PROCEDURE IF EXISTS insertar_usuario",
        "DROP PROCEDURE IF EXISTS insertar_coche",
        "DROP PROCEDURE IF EXISTS insertar_ficha_tecnica_coche",
        "DROP PROCEDURE IF EXISTS insertar_mantenimiento_periodico",
      ];

      await Promise.all(queries.map((query) => pool.query(query)));

      console.log(
        "Todos los procedimientos han sido eliminados correctamente."
      );
    } catch (error) {
      console.error("Error al eliminar los procedimientos:", error);
    }

    const users = [
      {
        email: "admin@example.com",
        password: "admin",
        nombre: "admin",
        coche: "coche1",
        matricula: "1234ABC",
        role: "admin",
        telefono: "123456789",
        direccion: "Calle Example 123",
      },
    ];

    for (const user of users) {
      user.id = uuid();
      user.password = await hashPassword(user.password);
      user.registrationCode = "regCode" + Math.floor(Math.random() * 1000);
      user.recoverPassCode = "recov" + Math.floor(Math.random() * 1000);
    }

    const userInsertPromise = users.map((user) =>
      pool.query(
        `INSERT INTO users (id, nombre, email, password, coche, matricula, role, registrationCode, recoverPassCode, telefono, direccion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          user.id,
          user.nombre,
          user.email,
          user.password,
          user.coche,
          user.matricula,
          user.role,
          user.registrationCode,
          user.recoverPassCode,
          user.telefono,
          user.direccion,
        ]
      )
    );

    await Promise.all(userInsertPromise);

    console.log("Base de datos inicializada con éxito");
  } catch (error) {
    console.error("Error al inicializar la base de datos:", error);
  } finally {
    if (pool) {
      await pool.end();
    }
  }
};

main();
