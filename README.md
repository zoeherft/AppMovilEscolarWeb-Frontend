# Plataforma Web de Eventos Escolares 🎓

Interfaz de usuario construida con **Angular 16** y **Angular Material** para administrar eventos académicos en instituciones educativas.

---

## Producción

🌐 **Aplicación**: https://app-eventos-frontend.vercel.app

🔗 **Servidor API**: https://app-eventos-backend.onrender.com

---

## Contenido

- [Descripción General](#descripción-general)
- [Herramientas Utilizadas](#herramientas-utilizadas)
- [Requisitos del Sistema](#requisitos-del-sistema)
- [Puesta en Marcha](#puesta-en-marcha)
- [Archivos de Entorno](#archivos-de-entorno)
- [Comandos de Ejecución](#comandos-de-ejecución)
- [Deploy en Vercel](#deploy-en-vercel)
- [Arquitectura del Proyecto](#arquitectura-del-proyecto)
- [Permisos según Rol](#permisos-según-rol)
- [Rutas de la Aplicación](#rutas-de-la-aplicación)
- [Problemas Frecuentes](#problemas-frecuentes)
- [Desarrollo Local](#desarrollo-local)

---

## Descripción General

Esta aplicación web permite:

✔️ Gestión integral de eventos académicos con validaciones completas

✔️ Sistema de roles (Administrador, Docente, Estudiante)

✔️ Autenticación mediante cookies seguras

✔️ Tablas interactivas con ordenamiento, filtrado y paginación

✔️ Formularios con validación instantánea

✔️ Visualización de estadísticas mediante gráficos

✔️ Interfaz adaptable a cualquier dispositivo

✔️ Selector de fechas con restricciones configurables

✔️ Máscaras de entrada para datos específicos

---

## Herramientas Utilizadas

| Librería | Versión | Función |
|----------|---------|---------|
| Angular | 16.2.0 | Framework SPA |
| Angular Material | 16.2.14 | Biblioteca de componentes |
| Bootstrap | 5.3.8 | Framework CSS |
| ng2-charts | 4.1.1 | Componentes de gráficas |
| ngx-cookie-service | 16.1.0 | Gestión de cookies |
| ngx-mask | 16.4.2 | Formateo de inputs |

---

## Requisitos del Sistema

Verifica tener instalado:

**Node.js versión 18 o superior**
```bash
node --version
```

**npm versión 9 o superior**
```bash
npm --version
```

**Angular CLI versión 16**
```bash
npm install -g @angular/cli@16
ng version
```

---

## Puesta en Marcha

### Clonar repositorio

```bash
git clone https://github.com/zoeherft/AppMovilEscolarWeb-Frontend.git
cd AppMovilEscolarWeb-Frontend
```

### Descargar dependencias

```bash
npm install
```

---

## Archivos de Entorno

El proyecto maneja dos configuraciones:

**Desarrollo** - `src/environments/environment.ts`
```typescript
export const environment = {
  production: false,
  url_api: 'http://127.0.0.1:8000'
};
```

**Producción** - `src/environments/environment.prod.ts`
```typescript
export const environment = {
  production: true,
  url_api: 'https://app-eventos-backend.onrender.com'
};
```

---

## Comandos de Ejecución

**Servidor de desarrollo**
```bash
ng serve
```
Navega a http://localhost:4200/

**Abrir navegador automáticamente**
```bash
ng serve --open
```

**Usar puerto alternativo**
```bash
ng serve --port 4300
```

---

## Deploy en Vercel

### Proceso automatizado

1. Vincula el repositorio desde [vercel.com](https://vercel.com)

2. La configuración ya existe en `vercel.json`:
```json
{
  "buildCommand": "npm run vercel-build",
  "outputDirectory": "dist/app-movil-escolar-frontend",
  "routes": [...]
}
```

3. Los commits a main disparan el deploy automático

### Configuración adicional
El proyecto no requiere variables de entorno en Vercel.

---

## Arquitectura del Proyecto

```
AppMovilEscolarWeb-Frontend/
├── src/
│   ├── app/
│   │   ├── layouts/           # Plantillas base
│   │   ├── screens/           # Vistas principales
│   │   ├── partials/          # Componentes parciales
│   │   ├── modals/            # Ventanas emergentes
│   │   ├── services/          # Comunicación con API
│   │   ├── shared/            # Elementos compartidos
│   │   ├── app.module.ts      # Módulo raíz
│   │   └── app-routing.module.ts
│   │
│   ├── environments/          # Variables por entorno
│   ├── assets/                # Recursos estáticos
│   └── styles.scss            # Estilos generales
│
├── angular.json               # Config de Angular
├── vercel.json                # Config de Vercel
└── package.json               # Dependencias npm
```

---

## Permisos según Rol

| Acción | Admin | Docente | Estudiante |
|--------|:-----:|:-------:|:----------:|
| Visualizar eventos | ✅ | ✅ | ✅ (solo su programa) |
| Agregar eventos | ✅ | ❌ | ❌ |
| Modificar eventos | ✅ | ❌ | ❌ |
| Eliminar eventos | ✅ | ❌ | ❌ |
| Administrar usuarios | ✅ | ❌ | ❌ |
| Consultar estadísticas | ✅ | ❌ | ❌ |

---

## Rutas de la Aplicación

| URL | Vista | Restricción |
|-----|-------|-------------|
| `/login` | Acceso al sistema | Pública |
| `/home` | Panel principal | Usuario autenticado |
| `/eventos-academicos` | Listado de eventos | Usuario autenticado |
| `/registro-eventos` | Formulario de eventos | Solo administrador |
| `/administradores` | Tabla de admins | Solo administrador |
| `/maestros` | Tabla de docentes | Admin y docente (lectura) |
| `/alumnos` | Tabla de estudiantes | Admin y docente (lectura) |
| `/graficas` | Panel de métricas | Solo administrador |

---

## Problemas Frecuentes

### Error "Cannot find module"
Reinstala las dependencias:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Puerto 4200 ocupado
Utiliza un puerto diferente:
```bash
ng serve --port 4300
```

### Error 401 al consumir API
Cierra e inicia sesión nuevamente.

### Página vacía en Vercel
Revisa que `vercel.json` contenga las rutas correctamente.

---

## Desarrollo Local

Para trabajar en modo desarrollo necesitas ambos servicios:

**Terminal 1 - Levantar API** (puerto 8000)
```bash
cd AppMovilEscolarWeb-Backend
source venv/bin/activate
python manage.py runserver
```

**Terminal 2 - Levantar Frontend** (puerto 4200)
```bash
cd AppMovilEscolarWeb-Frontend
ng serve
```

**Abrir en navegador**: http://localhost:4200

---

## Datos del Proyecto

| Campo | Valor |
|-------|-------|
| Curso | Desarrollo de Aplicaciones Móviles |
| Institución | Universidad |
| Fecha | Noviembre 2025 |

---

## Licencia

Proyecto con propósitos educativos. Derechos reservados.
