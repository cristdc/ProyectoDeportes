# Frontend Web - Aplicación de Ciclismo

## 🌟 Descripción General
Aplicación web desarrollada con React + Vite para gestionar carreras de ciclismo. Permite a los usuarios ver carreras disponibles, inscribirse, ver su historial y gestionar su perfil.

## 🛠 Tecnologías Principales
- React 19.0.0
- React Router DOM 7.2.0
- Tailwind CSS 4.0.9
- Vite 6.2.0
- Sonner 2.0.1 (para notificaciones)

## 📁 Estructura del Proyecto

- src/
- components/ Componentes reutilizables
- context/ Contextos de React (Auth, Race)
- layout/ Layouts principales
- pages/ Páginas de la aplicación
- router/ Configuración de rutas

## 🔐 Gestión de Autenticación
El sistema utiliza un contexto de autenticación (`AuthContext`) que maneja:
- Login/Logout de usuarios
- Almacenamiento de token en localStorage
- Verificación de autenticación
- Gestión de inscripciones del usuario

## 📍 Endpoints Frontend

### Rutas Públicas
- `/login` - Página de inicio de sesión

### Rutas Protegidas
- `/` - Página principal (Home)
- `/profile` - Perfil del usuario
- `/carreras-disponibles` - Lista de carreras disponibles
- `/carreras-historial` - Historial de carreras
- `/carrerasDetail/:carreraId` - Detalles de una carrera específica
- `/mis-carreras` - Carreras en las que está inscrito el usuario

## 🔄 Contextos

### AuthContext
Gestiona:
- Estado de autenticación
- Información del usuario
- Inscripciones del usuario
- Token JWT
- Métodos de login/logout

### RaceContext
Gestiona:
- Lista de carreras
- Detalles de carreras individuales
- Estado de carga
- Paginación
- Métodos de fetch de carreras

## 🎯 Funcionalidades Principales

### Gestión de Carreras
- Visualización de carreras disponibles
- Filtrado por deporte (ciclismo)
- Vista detallada de cada carrera
- Descarga de información de carreras

### Inscripciones
- Inscripción a carreras
- Cancelación de inscripciones
- Visualización de estado de inscripciones
- Historial de participaciones

### Perfil de Usuario
- Visualización de datos personales
- Gestión de inscripciones
- Historial de participaciones

## 🔧 Configuración del Proyecto

### Variables de Entorno

- VITE_API_CICLISMO_URL=http://localhost:3000/api

### Comandos disponibles

- npm start # Inicia el servidor de desarrollo
- npm run build (Construye la aplicación para producción)
- npm run preview (Vista previa de la build)
- npm run lint (Ejecuta el linter)

## 🚀 Características Adicionales
- Diseño responsive con Tailwind CSS
- Sistema de notificaciones con Sonner
- Protección de rutas para usuarios autenticados
- Manejo de estados de carga y errores
- Paginación en listados

## ⚠️ Notas Importantes
- La aplicación requiere conexión al backend para funcionar
- Las IPs de los fetchs deben configurarse según el entorno
- El token y estado de autenticación se almacenan en localStorage
- Sistema de descarga de archivos pendiente de implementación completa