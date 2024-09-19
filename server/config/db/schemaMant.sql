CREATE DATABASE IF NOT EXISTS mantenimiento;

USE mantenimiento;

CREATE TABLE IF NOT EXISTS users (
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
);

CREATE TABLE IF NOT EXISTS coches (
    matricula VARCHAR(10) NOT NULL UNIQUE PRIMARY KEY,
    marca VARCHAR(20) NOT NULL,
    modelo VARCHAR(30) NOT NULL,
    plazas INT(10) NOT NULL,
    kilometros INT(100) NOT NULL,
    itv TINYINT(1) NOT NULL,
    itv_fecha DATE NOT NULL,
    ultimo_mantenimiento DATE NOT NULL,
    FOREIGN KEY (matricula) REFERENCES users(matricula)
);

CREATE TABLE IF NOT EXISTS ficha_tecnica_coches (
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
);

CREATE TABLE IF NOT EXISTS mantenimiento_periodico (
    matricula VARCHAR(20) NOT NULL,
    cambio_filtro_aire VARCHAR(100) NOT NULL,
    cambio_filtro_gasolina VARCHAR(100) NOT NULL,
    cambio_filtro_aceite_motor VARCHAR(100) NOT NULL,
    cambio_filtro_aceite_diferencial VARCHAR(100) NOT NULL,
    cambio_bujias VARCHAR(100) NOT NULL,
    revision_bandas VARCHAR(100) NOT NULL,
    cambio_aceite_transmision VARCHAR(100) NOT NULL,
    cambio_aceite_direccion VARCHAR(100) NOT NULL,
    cambio_aceite_frenos VARCHAR(100) NOT NULL,
    revision_ruedas_delanteras VARCHAR(100) NOT NULL,
    revision_ruedas_traseras VARCHAR(100) NOT NULL,
    revision_cigueñales VARCHAR(100) NOT NULL,
    FOREIGN KEY (matricula) REFERENCES coches(matricula)
);


DELIMITER //
CREATE TRIGGER trigger_update_ultimo_mantenimiento
BEFORE UPDATE ON coches
FOR EACH ROW
BEGIN
    SET NEW.ultimo_mantenimiento = CURRENT_DATE;
END;
//
DELIMITER ;


DELIMITER //
CREATE TRIGGER trigger_update_itv_fecha
BEFORE UPDATE ON coches
FOR EACH ROW
BEGIN
    SET NEW.itv_fecha = CURRENT_DATE;
END;
//
DELIMITER ;