# 🎓 Sistema de Gestión de Eventos Académicos - Frontend

Aplicación web desarrollada con **Angular 16** y **Angular Material** para la gestión de eventos académicos universitarios. Permite administrar eventos (Conferencias, Talleres, Seminarios, Concursos) y usuarios con control de acceso basado en roles.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración del Entorno](#-configuración-del-entorno)
- [Ejecución](#-ejecución)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Funcionalidades](#-funcionalidades)
- [Pantallas](#-pantallas)

---

## ✨ Características

- ✅ **CRUD de Eventos Académicos** con validaciones completas
- ✅ **Control de acceso por roles** (Admin, Maestro, Alumno)
- ✅ **Autenticación** con manejo de tokens (cookies)
- ✅ **Tablas dinámicas** con paginación, ordenamiento y filtrado
- ✅ **Formularios reactivos** con validación en tiempo real
- ✅ **Gráficas estadísticas** con datos dinámicos del API
- ✅ **Diseño responsivo** con Angular Material y Bootstrap
- ✅ **DatePicker** para selección de fechas
- ✅ **Modales de confirmación** para eliminación

---

## 🛠 Tecnologías

| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| Angular | 16.2.0 | Framework principal |
| Angular Material | 16.2.14 | Componentes UI (Tables, DatePicker, Forms) |
| Bootstrap | 5.3.8 | Estilos CSS responsivos |
| Bootstrap Icons | 1.13.1 | Iconografía |
| ng2-charts | 4.1.1 | Gráficas dinámicas |
| ngx-cookie-service | 16.1.0 | Manejo de cookies/tokens |
| ngx-mask | 16.4.2 | Máscaras de input |

---

## 📦 Requisitos Previos

1. **Node.js 18.x o superior**
   ```bash
   node --version
   ```

2. **npm 9.x o superior**
   ```bash
   npm --version
   ```

3. **Angular CLI 16.x**
   ```bash
   npm install -g @angular/cli@16
   ng version
   ```

4. **Backend corriendo** en `http://127.0.0.1:8000`

---

## 🚀 Instalación

### Paso 1: Navegar al proyecto

```bash
cd app-movil-escolar-frontend
```

### Paso 2: Instalar dependencias

```bash
npm install
```

### Paso 3: Verificar instalación

```bash
ng version
```

---

## ⚙️ Configuración del Entorno

### Desarrollo (`src/environments/environment.ts`)

```typescript
export const environment = {
  production: false,
  url_api: 'http://127.0.0.1:8000'
};
```

### Producción (`src/environments/environment.prod.ts`)

```typescript
export const environment = {
  production: true,
  url_api: 'https://tu-backend-produccion.com'
};
```

---

## ▶️ Ejecución

```bash
# Iniciar servidor de desarrollo
ng serve

# Abrir automáticamente en navegador
ng serve --open

# Puerto personalizado
ng serve --port 4300
```

La aplicación estará disponible en: `http://localhost:4200/`

---

## 📁 Estructura del Proyecto

```
app-movil-escolar-frontend/
├── src/
│   ├── app/
│   │   ├── layouts/
│   │   │   ├── auth-layout/           # Layout para login
│   │   │   └── dashboard-layout/      # Layout principal con sidebar
│   │   │
│   │   ├── screens/
│   │   │   ├── login-screen/          # Inicio de sesión
│   │   │   ├── home-screen/           # Dashboard principal
│   │   │   ├── eventos-screen/        # 📅 Lista de eventos académicos
│   │   │   ├── registro-eventos-screen/ # 📅 Formulario de eventos
│   │   │   ├── admin-screen/          # Lista de administradores
│   │   │   ├── maestros-screen/       # Lista de maestros
│   │   │   ├── alumnos-screen/        # Lista de alumnos
│   │   │   ├── registro-usuarios-screen/
│   │   │   └── graficas-screen/       # Gráficas con datos dinámicos
│   │   │
│   │   ├── partials/
│   │   │   ├── registro-eventos/      # 📅 Formulario de evento
│   │   │   ├── registro-admin/
│   │   │   ├── registro-alumnos/
│   │   │   ├── registro-maestros/
│   │   │   ├── navbar-user/
│   │   │   └── sidebar/
│   │   │
│   │   ├── modals/
│   │   │   ├── eliminar-evento-modal/ # 📅 Confirmación eliminar evento
│   │   │   └── eliminar-user-modal/
│   │   │
│   │   ├── services/
│   │   │   ├── eventos.service.ts     # 📅 Servicio HTTP de eventos
│   │   │   ├── facade.service.ts      # Auth y cookies
│   │   │   ├── administradores.service.ts
│   │   │   ├── maestros.service.ts
│   │   │   ├── alumnos.service.ts
│   │   │   └── tools/
│   │   │
│   │   ├── app.module.ts
│   │   └── app-routing.module.ts
│   │
│   ├── environments/
│   └── styles.scss
│
├── angular.json
├── package.json
└── README.md
```

---

## 🎯 Funcionalidades

### 📅 Eventos Académicos (NUEVO)

| Funcionalidad | Rol Admin | Rol Maestro | Rol Alumno |
|---------------|-----------|-------------|------------|
| Ver lista de eventos | ✅ Todos | ✅ Todos | ✅ Solo su programa |
| Ver detalle de evento | ✅ | ✅ | ✅ |
| Crear evento | ✅ | ❌ | ❌ |
| Editar evento | ✅ | ❌ | ❌ |
| Eliminar evento | ✅ | ❌ | ❌ |

### Validaciones del Formulario de Eventos

| Campo | Validación |
|-------|------------|
| Nombre del evento | Alfanumérico con espacios, requerido |
| Tipo de evento | Selección requerida |
| Fecha de realización | No puede ser anterior a hoy |
| Hora inicio/fin | Hora inicio debe ser menor que hora fin |
| Lugar | Requerido |
| Público objetivo | Al menos uno seleccionado |
| Programa educativo | Requerido si público incluye "Alumnos" |
| Descripción | Máximo 300 caracteres |
| Cupo máximo | Máximo 3 dígitos (1-999) |

### 👥 Gestión de Usuarios

- CRUD completo para Administradores, Maestros y Alumnos
- Tablas con paginación, ordenamiento y filtros
- Validación de formularios

### 📊 Gráficas Dinámicas

- Gráfica circular (Pie) con total de usuarios por rol
- Gráfica de dona (Doughnut) con distribución de usuarios
- Datos obtenidos en tiempo real del API

---

## 📱 Pantallas Principales

### 1. Login (`/login`)
- Inicio de sesión con email y contraseña

### 2. Dashboard (`/home`)
- Tarjetas con estadísticas
- Accesos rápidos

### 3. Eventos Académicos (`/eventos-academicos`) 📅
- Tabla con todos los eventos
- Filtro por búsqueda
- Columnas: Nombre, Tipo, Fecha, Hora, Lugar, Responsable
- Botones Editar/Eliminar (solo Admin)

### 4. Registro de Evento (`/registro-eventos`) 📅
- Formulario completo con validaciones
- DatePicker para fecha
- Checkboxes para público objetivo
- Select condicional para programa educativo

### 5. Gráficas (`/graficas`)
- Visualización de datos dinámicos
- Total de usuarios por rol

---

## 🔌 Servicio de Eventos

```typescript
// eventos.service.ts - Métodos principales

// Obtener esquema vacío de evento
esquemaEvento(): EventoAcademico

// Validar datos del formulario
validarEvento(data: EventoAcademico, editando: boolean): string[]

// CRUD
registrarEvento(data: EventoAcademico): Observable<any>
obtenerEventos(): Observable<EventoAcademico[]>
obtenerEventoPorId(id: number): Observable<EventoAcademico>
actualizarEvento(data: EventoAcademico): Observable<any>
eliminarEvento(id: number): Observable<any>

// Catálogos
getResponsables(): Observable<any[]>
getTiposEvento(): {value, label}[]
getPublicoObjetivo(): {value, label}[]
getProgramasEducativos(): {value, label}[]
```

---

## 🔧 Solución de Problemas

### Error: "Cannot find module"
```bash
rm -rf node_modules
npm install
```

### Error: "Port 4200 is already in use"
```bash
ng serve --port 4300
```

### Error 401 Unauthorized
Cerrar sesión y volver a iniciar sesión.

---

## 🔄 Flujo de Trabajo

1. **Iniciar Backend**
   ```bash
   cd app-movil-escolar-backend
   source venv/bin/activate
   python manage.py runserver
   ```

2. **Iniciar Frontend**
   ```bash
   cd app-movil-escolar-frontend
   ng serve --open
   ```

3. **Acceder**: `http://localhost:4200`

---

## 👥 Autores

- **Materia**: Desarrollo de Aplicaciones Móviles
- **Semestre**: Séptimo Semestre  
- **Fecha**: Noviembre 2025

---

## 📄 Licencia

Este proyecto es para fines educativos.
