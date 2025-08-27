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

### 4. Crear un archivo .env en /backend (basado en .env.example):

Copiar el archivo de ejemplo y renombrarlo
Editar el nuevo .env con tus credenciales:

postgres: usuario de PostgreSQL en tu PC.
password: La contraseña que pusiste al instalar PostgreSQL.
taskflowds: Nombre de la base de datos que usarás.
JWT_SECRET: Se cambia por algo más fuerte en producción.

### 5. Migrar la base de datos:

npx prisma migrate dev --name init

### 6. Levantar el servidor:

npm run dev
