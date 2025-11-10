
Prototipo estático e interactivo - Interfaz inspirada en la imagen

Archivos:
- index.html  -> prototipo HTML estático e interactivo (login, dashboard, modal QR)
- styles.css  -> estilos para el prototipo
- app.js      -> comportamiento mínimo (login demo, apertura de QR)

Cómo abrir rápido:
- Opción 1 (doble clic): abre `index.html` en el explorador (funciona para ver el diseño estático).
- Opción 2 (servidor local simple con Node): en PowerShell, dentro de `SAA\frontend` instala `http-server` si quieres:
  npm i -g http-server; http-server -c-1 .
  Luego abre http://localhost:8080

Integración mínima con `app.js` (Express):
Si quieres servir el frontend desde tu app Node existente, añade algo como:

  // en app.js (ejemplo):
  const express = require('express');
  const app = express();
  app.use(express.static(path.join(__dirname, 'frontend')));
  // arrancar el servidor normalmente

Siguientes pasos sugeridos:
- Ajustar colores y tipografías al branding real.
- Convertir a componentes React/Vue si la aplicación requiere interacción dinámica.
- Conectar datos reales (listas, tareas, usuarios) desde la API del backend.

Si quieres, puedo:
- Convertir este prototipo a React (CRA/Vite) y mapear componentes.
- Conectar la UI a tu API existente en `Geestor-de-tareas`.
- Mejorar el calendario/tabla con plugins (FullCalendar, DataTables).

Dime cuál de esos pasos prefieres y lo implemento.
 
 Notas rápidas:
 - Credenciales demo integradas: Alumno 1234567890 / alumno123, Maestro 0987654321 / maestro123
 - Abrir `index.html` en un navegador es suficiente para probar el flujo.