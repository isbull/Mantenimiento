import express from "express";

const app = express();
app.listen(8000, () => {
  console.log(`Servidor escuchando en el puerto http://localhost:${8000}`);

  console.log("Hola mundo");
});
