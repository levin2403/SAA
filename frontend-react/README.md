```markdown
# Frontend React — SAA (Vite + React + Tailwind)

Proyecto frontend creado con Vite, React 18 y Tailwind CSS. Esta carpeta contiene una versión desarrollable de la interfaz (opción A) que implementa: login de prueba, dashboard, toma de lista y reportes con exportación CSV.

Contenido principal
- `index.html` — plantilla de entrada para Vite
- `package.json` — scripts y dependencias
- `vite.config.js` — configuración de Vite
- `postcss.config.cjs`, `tailwind.config.cjs` — configuración de Tailwind
- `src/` — código fuente React
  - `main.jsx` — punto de entrada
  - `index.css` — estilos (Tailwind)
  - `App.jsx` — wrapper que monta `AttendanceSystem`
  - `components/AttendanceSystem.jsx` — componente principal (login, dashboard, asistencia, reportes)

Requisitos
- Node.js (14+ recomendado)
- npm o yarn

Instalación y ejecución (PowerShell — Windows)

1. Abrir PowerShell en `SAA\frontend-react`
2. Instalar dependencias:

   npm install

3. Levantar servidor de desarrollo (Vite):

   npm run dev

4. Abrir la URL que Vite muestre (por defecto http://localhost:5173)

Notas sobre la demo
- Esta implementación usa `localStorage` para persistir datos de asistencia localmente. No hay integración con backend; tu equipo puede implementar endpoints REST y conectarlos al componente.
- Hay credenciales demo para probar flujo:
  - Alumno: ID `1234567890`, password `alumno123`
  - Maestro: ID `0987654321`, password `maestro123`
- Exportación de reportes: genera CSV descargable desde la interfaz.

Siguientes pasos sugeridos
- Conectar con la API del backend (endpoints recomendados en README del servidor).
- Añadir validación y manejo de usuarios reales (registro, roles, tokens JWT).
- Añadir tests unitarios y de integración para componentes críticos.

Si quieres, puedo:
- Ajustar la UI según la guía de estilo de tu proyecto.
- Implementar la capa de servicios para consumir la API (fetch/axios) y ejemplos de contratos.
- Añadir autenticación real (JWT) y demo de uso con el backend.

``` 
