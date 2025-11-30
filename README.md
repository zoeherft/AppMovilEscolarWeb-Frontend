# 🎓 Sistema de Gestión de Eventos Académicos - Frontend

Aplicación web desarrollada con **Angular 16** y **Angular Material** para la gestión de eventos académicos universitarios.

## 🌐 Despliegue

- **Producción**: [https://app-eventos-frontend.vercel.app](https://app-eventos-frontend.vercel.app)
- **Backend API**: [https://app-eventos-backend.onrender.com](https://app-eventos-backend.onrender.com)

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Ejecución](#-ejecución)
- [Despliegue en Vercel](#-despliegue-en-vercel)
- [Estructura del Proyecto](#-estructura-del-proyecto)

---

## ✨ Características

- ✅ **CRUD de Eventos Académicos** con validaciones completas
- ✅ **Control de acceso por roles** (Admin, Maestro, Alumno)
- ✅ **Autenticación** con tokens (cookies seguras)
- ✅ **Tablas dinámicas** con paginación, ordenamiento y filtrado
- ✅ **Formularios** con validación en tiempo real
- ✅ **Gráficas estadísticas** con datos del API
- ✅ **Diseño responsivo** con Angular Material y Bootstrap
- ✅ **DatePicker** con restricción de fechas
- ✅ **Validación de inputs** (solo letras, alfanuméricos, números)

---

## 🛠 Tecnologías

| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| Angular | 16.2.0 | Framework principal |
| Angular Material | 16.2.14 | Componentes UI |
| Bootstrap | 5.3.8 | Estilos CSS |
| ng2-charts | 4.1.1 | Gráficas |
| ngx-cookie-service | 16.1.0 | Manejo de cookies |
| ngx-mask | 16.4.2 | Máscaras de input |

---

## 📦 Requisitos Previos

1. **Node.js 18.x+**
   ```bash
   node --version
   ```

2. **npm 9.x+**
   ```bash
   npm --version
   ```

3. **Angular CLI 16.x**
   ```bash
   npm install -g @angular/cli@16
   ng version
   ```

---

## 🚀 Instalación

### Paso 1: Clonar y navegar

```bash
git clone https://github.com/ivanblueberry/app-eventos-frontend.git
cd app-movil-escolar-frontend
```

### Paso 2: Instalar dependencias

```bash
npm install
```

---

## ⚙️ Configuración

### Entornos

**Desarrollo** (`src/environments/environment.ts`):
```typescript
export const environment = {
  production: false,
  url_api: 'http://127.0.0.1:8000'
};
```

**Producción** (`src/environments/environment.prod.ts`):
```typescript
export const environment = {
  production: true,
  url_api: 'https://app-eventos-backend.onrender.com'
};
```

---

## ▶️ Ejecución

### Desarrollo
```bash
ng serve
# Disponible en: http://localhost:4200/
```

### Con apertura automática
```bash
ng serve --open
```

### Puerto personalizado
```bash
ng serve --port 4300
```

---

## 🚀 Despliegue en Vercel

### Configuración automática

1. **Conectar repositorio** en [vercel.com](https://vercel.com)

2. **El archivo `vercel.json`** ya está configurado:
   ```json
   {
     "buildCommand": "npm run vercel-build",
     "outputDirectory": "dist/app-movil-escolar-frontend",
     "routes": [...]
   }
   ```

3. **Push a main** para desplegar automáticamente

### Variables de Vercel (opcionales)
No se requieren variables de entorno adicionales.

---

## 📁 Estructura del Proyecto

```
app-movil-escolar-frontend/
├── src/
│   ├── app/
│   │   ├── layouts/           # Layouts (auth, dashboard)
│   │   ├── screens/           # Páginas principales
│   │   ├── partials/          # Componentes reutilizables
│   │   ├── modals/            # Modales de confirmación
│   │   ├── services/          # Servicios HTTP y utilidades
│   │   ├── shared/            # Componentes compartidos
│   │   ├── app.module.ts
│   │   └── app-routing.module.ts
│   │
│   ├── environments/          # Configuración por entorno
│   ├── assets/                # Imágenes y fuentes
│   └── styles.scss            # Estilos globales
│
├── angular.json               # Configuración de Angular
├── vercel.json                # Configuración de Vercel
├── package.json
└── README.md
```

---

## 🎯 Funcionalidades por Rol

| Funcionalidad | Admin | Maestro | Alumno |
|---------------|-------|---------|--------|
| Ver eventos | ✅ Todos | ✅ Todos | ✅ Su programa |
| Crear evento | ✅ | ❌ | ❌ |
| Editar evento | ✅ | ❌ | ❌ |
| Eliminar evento | ✅ | ❌ | ❌ |
| Gestionar usuarios | ✅ | ❌ | ❌ |
| Ver gráficas | ✅ | ✅ | ❌ |

---

## 📱 Pantallas

| Ruta | Descripción | Acceso |
|------|-------------|--------|
| `/login` | Inicio de sesión | Público |
| `/home` | Dashboard principal | Autenticado |
| `/eventos-academicos` | Lista de eventos | Autenticado |
| `/registro-eventos` | Crear/Editar evento | Solo Admin |
| `/administradores` | Gestión de admins | Solo Admin |
| `/maestros` | Gestión de maestros | Admin/Maestro |
| `/alumnos` | Gestión de alumnos | Admin/Maestro |
| `/graficas` | Estadísticas | Admin/Maestro |

---

## 🔧 Solución de Problemas

### "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### "Port 4200 already in use"
```bash
ng serve --port 4300
```

### Error 401 Unauthorized
Cerrar sesión y volver a iniciar.

### Pantalla en blanco en Vercel
Verificar que `vercel.json` tenga las rutas configuradas correctamente.

---

## 🔄 Flujo de Desarrollo

1. **Iniciar Backend** (puerto 8000)
   ```bash
   cd app-movil-escolar-backend
   source venv/bin/activate
   python manage.py runserver
   ```

2. **Iniciar Frontend** (puerto 4200)
   ```bash
   cd app-movil-escolar-frontend
   ng serve
   ```

3. **Acceder**: [http://localhost:4200](http://localhost:4200)

---

## 👥 Autores

- **Materia**: Desarrollo de Aplicaciones Móviles
- **Institución**: Universidad
- **Fecha**: Noviembre 2025

---

## 📄 Licencia

Proyecto educativo - Todos los derechos reservados.
