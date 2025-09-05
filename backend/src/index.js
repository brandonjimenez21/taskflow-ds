// Punto de entrada del servidor
const app = require("./app");  // importa el app.js

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});