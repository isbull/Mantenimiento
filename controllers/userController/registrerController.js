import express from "express";

const app = express();

app.post("/register", (req, res) => {
  try {
    const { nombre, email, password, telefono, direccion, matricula, coche } =
      req.body;

    if (
      !nombre ||
      !email ||
      !password ||
      !telefono ||
      !direccion ||
      !matricula ||
      !coche
    ) {
      return res.status(400).json({
        error: "Completa todos los campos",
      });
    }
    res.status(201).json({
      message: "Registro exitoso",
    });
  } catch (error) {
    console.error("Error en el registro:", error);
    res.status(500).json({
      error: "Error interno del servidor",
    });
  }
});
