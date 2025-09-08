# taskflow-ds - Gestor de Tareas
Proyecto #1

Proyecto de **Desarrollo de Software 2** – Universidad del Valle.  
Aplicación web para gestionar tareas con roles (Usuario / Gerente), filtros y estadísticas.

Integrantes:

Brandon Jimenez - 2371717
David Carvajal - 2329524
Brandon Fernandez - 2329662
Daniel Escobar - 2371732
Alejandro Fernández Herrera - 2223587
Alejandro Medina García - 2242772

---

## Tecnologías usadas

### **Frontend**
- [React](https://react.dev/) UI y componentes.
- [Vite](https://vitejs.dev/) servidor de desarrollo rápido.
- [TailwindCSS](https://tailwindcss.com/) estilos.
- [React Router](https://reactrouter.com/) (pendiente instalar) navegación.
- [Axios](https://axios-http.com/) (pendiente instalar) consumo de API.

### **Backend**
- [Node.js](https://nodejs.org/) entorno de ejecución.
- [Express](https://expressjs.com/) framework API REST.
- [CORS](https://www.npmjs.com/package/cors) permitir peticiones desde el frontend.
- [dotenv](https://www.npmjs.com/package/dotenv) manejo de variables de entorno.
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) autenticación con JWT.
- [bcryptjs](https://www.npmjs.com/package/bcryptjs) encriptación de contraseñas.
- [Prisma](https://www.prisma.io/) ORM para PostgreSQL.
- [PostgreSQL](https://www.postgresql.org/) base de datos.
- [Nodemon](https://www.npmjs.com/package/nodemon) reinicio automático en desarrollo.

---

## Instalación y ejecución

### 1. Clonar el repositorio

git clone https://github.com/tu-org/taskflow-ds.git
cd taskflow-ds

### 2. Configurar Frontend

cd frontend
npm install
npm run dev

### 3. Configurar Backend

cd backend
npm install

### 4. Crear un archivo .env en /backend:

Escribir al interno para la configuracion de este mismo

### 5. Migrar la base de datos:

npx prisma migrate dev --name init 

luego generar cliente de prisma
npx prisma generate

### 6. Levantar el servidor:

npm run dev

### 7. Herramientas necesarias para hacer las pruebas unitarias e integracion:

Node.js + npm (para ejecutar pruebas automatizadas).
Jest (npm install --save-dev jest)
Supertest (npm install --save-dev supertest)
Prisma Test Utils (npm install --save-dev @quramy/prisma-fabbrica o lib similar para DB mock/test).
Postman o Insomnia (para pruebas manuales de la API).
Prisma Studio (npx prisma studio) → inspección visual de la BD.

Instalar Please en el backend
Express: npm install express cors dotenv @prisma/client

npm install bcryptjs jsonwebtoken
npm install json2csv pdfkit
npm install svg-to-pdfkit

### 8. Tipos de pruebas:

1) Pruebas unitarias (código, con Jest)

Enfocadas en funciones individuales sin BD ni servidor.
Ejemplos:

Hash y verificación de contraseña (bcrypt).
Generación/verificación de JWT.
Validación de email único en capa de servicio.
Validaciones de negocio (ej: fecha de vencimiento > fecha inicio).

2) Pruebas de integración (código, con Jest + Supertest)

Enfocadas en probar endpoints con DB de pruebas.
Ejemplos:

POST /register: crea usuario y valida email único.
POST /login: devuelve token válido.
GET /tasks: lista tareas del usuario/gerente con filtros.
PUT /tasks/:id: solo dueño puede editar.
GET /stats: estadísticas correctas.

3) Pruebas manuales/visuales

Responsable: Todo el equipo (cada quien puede validar su parte y tomar screenshot)

Con Postman / Insomnia
Importar colección de endpoints.
Probar casos edge:
Intentar crear dos usuarios con el mismo email.
Crear tareas vencidas y ver si aparecen en estadísticas.
Probar login con credenciales incorrectas.

Con Prisma Studio
Revisar que al crear usuario/tarea vía API realmente aparezca en la BD.
Ver que al eliminar tareas desde el backend, se borren en la BD.