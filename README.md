Instalar dependencias:

Abre una terminal en la carpeta del proyecto Node.js y ejecuta:

Copiar código
npm i
Luego, abre otra terminal en la carpeta del proyecto Next.js y ejecuta:

Copiar código
npm i
Configurar la base de datos:

Abre SQL Server Management Studio y ve a la sección Security > Logins.

Haz clic derecho en el usuario sa, selecciona Properties y configura la contraseña como:


12345678
En la pestaña Status, asegúrate de activar la opción Login.
Iniciar los servidores:

En la terminal del proyecto Node.js, escribe:


npm start
En la terminal del proyecto Next.js, escribe:


npm run dev
Abrir en el navegador(Google, Edge):
Ve a la dirección:


http://localhost:3000





