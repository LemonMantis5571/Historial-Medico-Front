# Historial Médico

Aplicación web para la gestión de historiales médicos construida con React, Vite y HeroUI.

## Características

- **Gestión de Pacientes**: Agregar, visualizar y administrar registros de pacientes
- **Portal del Doctor**: Inicio de sesión y visualización de pacientes para doctores
- **Sistema de Citas**: Programar y gestionar citas médicas
- **Historial Médico**: Seguimiento de diagnósticos y registros médicos de pacientes
- **Dashboard**: Vista general de pacientes, citas y datos médicos
- **Diseño Responsivo**: Construido con Tailwind CSS y componentes HeroUI

## Tecnologías

- **Frontend**: React.js
- **Build Tool**: Vite
- **Lenguaje**: JavaScript
- **Componentes UI**: HeroUI
- **Estilos**: Tailwind CSS

## Estructura del Proyecto

```
src/
├── components/
│   └── Modal/           # Componentes modales reutilizables
├── assets/              # Imágenes y archivos estáticos
├── App.jsx             # Componente principal de la aplicación
├── main.jsx            # Punto de entrada de la aplicación
└── index.css           # Estilos globales
```

## Componentes Principales

- `PatientHistory.jsx` - Gestión del historial médico de pacientes
- `AppointmentModal.jsx` - Interfaz para programar citas
- `DoctorModal.jsx` - Portal del doctor y vista de pacientes
- `Dashboard.jsx` - Dashboard principal con resumen
- `PatientView.jsx` - Detalles individuales del paciente
- `login.jsx` - Sistema de autenticación

## Instalación y Uso

1. Clona el repositorio:
   ```bash
   git clone <url-del-repositorio>
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

4. Abre tu navegador en `http://localhost:5173`

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la construcción de producción

## Dependencias Principales

- React
- Vite
- HeroUI
- Tailwind CSS

## Configuración

La aplicación utiliza Tailwind CSS con HeroUI para los componentes de la interfaz. La configuración se encuentra en `tailwind.config.js`.

---

*Aplicación desarrollada para la gestión eficiente de historiales médicos.*