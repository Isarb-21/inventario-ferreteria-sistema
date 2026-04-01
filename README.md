# Sistema 💻 Inventario Ferreteria 🛠️


> Proyecto full-stack guiado por el docente — Programación Avanzada 2026A

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)](http://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)

---

## 📋 Tabla de Contenidos

- [Descripción del Proyecto](#-descripción-del-proyecto)
- [Stack Tecnológico](#-stack-tecnológico)
- [Arquitectura](#-arquitectura)
- [Modelo de Datos](#-modelo-de-datos)
- [Plan de Releases](#-plan-de-releases)
- [Sprints e Historias de Usuario](#-sprints-e-historias-de-usuario)
- [Cronograma](#-cronograma)
- [Definition of Done (DoD)](#-definition-of-done-dod)
- [Tablero Kanban](#-tablero-kanban)
- [Instalación y Ejecución](#-instalación-y-ejecución)

---

## 📖 Descripción del Proyecto

El **Sistema de Inventario para Ferretería** es una aplicación web full-stack que permite administrar el inventario, los proveedores y las operaciones de compra y venta de una ferretería. Reemplaza el control manual en cuadernos por una plataforma centralizada que garantiza trazabilidad de movimientos y control de existencias en tiempo real.

### Alcance

| Aspecto | Detalle |
|---|---|
| **Tipo** | Proyecto demostrativo — Guiado por el Docente |
| **Entidades** | 8 entidades con relaciones (ver modelo de datos) |
| **Historias de Usuario** | 9 HUs organizadas en 4 sprints |
| **Releases** | 2 releases alineados con los cortes académicos |
| **Casos de Uso** | 5 CUs  (productos, proveedores, compras, ventas y stock) |

### Funcionalidades Principales

- ✅ CRUD completo de Productos y Categorías del catálogo
- ✅ Gestión de Proveedores con asociación de productos suministrados (relación N:M)
- ✅ Registro de Compras a proveedores con actualización automática de stock
- ✅ Registro de Ventas al público con validación de stock disponible y descuento automático
- ✅ Historial de Compras filtrable por proveedor
- ✅ Consulta de Historial de Ventas con detalle por venta
- ✅ Alerta de Productos con Stock Bajo el Mínimo establecido
- ✅ Common Module: Filtros de excepción, Interceptores y Pipes globales
- ✅ Integración completa Frontend ↔ Backend con Docker Compose
---

## 🛠 Stack Tecnológico

| Capa | Tecnología | Propósito |
|---|---|---|
| **Backend** | NestJS (Node.js + TypeScript) | API REST con arquitectura en capas |
| **Frontend** | Next.js 14+ (React + TypeScript) | Interfaz de usuario con App Router |
| **Base de Datos** | PostgreSQL 16 | Almacenamiento relacional |
| **ORM** | Prisma | Modelado de datos, migraciones y queries |
| **Contenedores** | Docker + Docker Compose | Orquestación de servicios |
| **Validación** | class-validator + class-transformer | DTOs y validación de entrada |

---

## 🏗 Arquitectura

El proyecto sigue una **arquitectura en capas** con separación de responsabilidades:

```
Cliente HTTP → Controller (valida DTO + ruta) → Service (lógica de negocio) → Repository (acceso a datos) → Prisma / PostgreSQL
```

### Estructura del Proyecto

```
proyecto/
├── docker-compose.yml
├── .env.example
├── backend/                        # API REST con NestJS
│   ├── Dockerfile
│   ├── src/
│   │   ├── common/                 # Módulo compartido (cross-cutting)
│   │   │   ├── filters/            # Filtros de excepción globales
│   │   │   ├── interceptors/       # Interceptores de respuesta
│   │   │   ├── pipes/              # Pipes de validación
│   │   │   └── guards/             # Guards de autenticación
│   │   ├── prisma/                 # Módulo Prisma (acceso a BD)
│   │   └── modules/                # Módulos de dominio
│   │       └── [entidad]/
│   │           ├── controller/     # Solo manejo HTTP
│   │           ├── service/        # Lógica de negocio
│   │           ├── repository/     # Acceso a datos (Prisma)
│   │           ├── dto/            # Validación de entrada
│   │           └── entities/       # Representación del dominio
│   └── prisma/
│       ├── schema.prisma
│       └── migrations/
│
├── frontend/                       # Interfaz con Next.js
│   ├── Dockerfile
│   ├── src/
│   │   ├── app/                    # App Router (páginas)
│   │   ├── components/             # Componentes reutilizables
│   │   ├── services/               # Capa de acceso a la API
│   │   ├── interfaces/             # Tipos e interfaces TypeScript
│   │   └── lib/                    # Utilidades
│   └── package.json
│
└── README.md
```

---

## 📊 Modelo de Datos

### Diagrama de Relaciones

```
Categoria           1 ──── N  Producto
Proveedor           N ──── M  Producto
Proveedor           1 ──── N  Compra
Compra              1 ──── N  DetalleCompra
Producto            1 ──── N  DetalleCompra
Venta               1 ──── N  DetalleVenta 
Producto            1 ──── N  DetalleVenta 
```

### Entidades

| Entidad | Campos Principales |
|---|---|
| **Categoria** | id, nombre (unique), descripcion |
| **Producto** | id, nombre, codigo (unique), categoriaId, precioCompra, precioVenta, stock, stockMinimo |
| **Proveedor** | id, nombre, nit (unique), telefono, correo, direccion  |
| **ProveedorProducto** | proveedorId, productoId (compound unique)  |
| **Compra** | id, proveedorId, fecha, total  |
| **DetalleCompra** | id, compraId, productoId, cantidad, precioUnitario  |
| **Venta** | id, fecha, total  |
| **DetalleVenta ** | id, ventaId, productoId, cantidad, precioUnitario |

---

## 🚀 Plan de Releases

### Release 1 — Segundo Corte: Backend + Frontend Base

> **📅 Cierre: 14 de Abril de 2026** · Sprints 1 y 2

**Objetivo:** Entregar la API REST completa con arquitectura en capas (Controller → Service → Repository) y el frontend con las vistas de CRUD para todas las entidades base. 

| Sprint | Período | HUs | Alcance |
|---|---|---|---|
| [Sprint 1](#sprint-1--infraestructura-y-entidades-base) | Mar 31 → Abr 11 | HU-01, HU-02, HU-03 | Docker Compose, Prisma schema, migraciones, módulos CRUD de Categoria, Producto y Proveedor  |
| [Sprint 2](#sprint-2--entidades-académicas-y-cross-cutting) | Abr 13 → Abr 14  | HU-04 | Asociación Proveedor Producto (muchos a muchos), Common module (Filters, Pipes, Interceptors), Frontend: estructura Next.js, listados y formularios de entidades base |

### Release 2 — Tercer Corte: Integración y Despliegue

> **📅 Cierre: 22 de Mayo de 2026** · Sprints 4 y 5

**Objetivo:** Integración completa frontend ↔ backend, formularios avanzados con relaciones, registro de compras y ventas desde la interfaz y despliegue funcional con Docker. 

| Sprint | Período | HUs | Alcance |
|---|---|---|---|
| [Sprint 3](#sprint-3--frontend-avanzado-e-integración) | Abr 16 → May 8 | HU-05, HU06, HU-07, HU-08 |Módulos de Compra y Venta con transacciones atómicas (prisma.$transaction), actualización automática de stock, historial con paginación. Frontend: formularios con relaciones (selects dinámicos), páginas de detalle, navegación completa, estados de carga y error.  |
| [Sprint 4](#sprint-4--cierre-y-despliegue) |May 11 → May 18 | HU-09 | Alerta de stock bajo mínimo, integración de flujos completos (comprar → actualizar stock → vender → alertar), pruebas de integración, despliegue con Docker Compose, README. |

---

## 📌 Sprints e Historias de Usuario

### Sprint 1 — Infraestructura y entidades base

> 📅 **Mar 31 → Abr 11** · 🚫 Festivo: Abr 2 (Jueves Santo) Abr 3 (Viernes Santo) · <!-- TODO: Agregar enlace al Milestone en GitHub -->

| # | Historia de Usuario | Labels | Issue |
|---|---|---|---|
| HU-01 | Registro de Productos| `user-story` `backend` `frontend` | <!-- TODO --> |
| HU-02 | Gestión de Categorías de Productos| `user-story` `backend` `frontend` | <!-- TODO --> |
| HU-03 | Registro de Proveedores| `user-story` `backend` `frontend` | <!-- TODO --> |

**Entregables:**
- Docker Compose con PostgreSQL, NestJS y Next.js
- Prisma schema con entidades Estudiante, Docente y ProgramaAcademico
- Migraciones ejecutadas
- CRUD completo (Controller → Service → Repository) para las 3 entidades
- Frontend: listados y formularios básicos

---

### Sprint 2 — Relaciones, módulos avanzados y Frontend base 

> 📅 **Abr 13 → Abr 14** · 📝 Cierre Segundo Corte: Abr 17 · <!-- TODO: Agregar enlace al Milestone en GitHub -->

| # | Historia de Usuario | Labels | Issue |
|---|---|---|---|
| HU-04 | Asociación de Productos a Proveedor| `user-story` `backend` `frontend` | <!-- TODO --> |


**Entregables:**
- Asociación Proveedor-Producto (relación N:M con tabla intermedia ProveedorProducto)
- Endpoints para asociar/desasociar productos a un proveedor (POST y DELETE /proveedores/:id/productos)
- Endpoint para consultar proveedores de un producto (GET /productos/:id/proveedores)
- Common module: Filters, Interceptors, Pipes
- Frontend base: estructura Next.js, listados y formularios de Productos, Categorías y Proveedores

---

### Sprint 3 — Compras, Ventas y Frontend avanzado 

> 📅 **Abr 16 → May 8 ** ·🚫 Festivo: May 1 (Dia del Trabajo) · <!-- TODO: Agregar enlace al Milestone en GitHub -->

| # | Historia de Usuario | Labels | Issue |
|---|---|---|---|
| HU-05 | Registro de Compra a Proveedor| `user-story` `backend` `frontend` | <!-- TODO --> |
| HU-06 | Consulta de Historial de Compras por Proveedor | `user-story` `backend` `frontend` | <!-- TODO --> |
| HU-07 | Registro de Venta al Público | `user-story` `backend` `frontend` | <!-- TODO --> |
| HU-08 | Consulta de Historial de Ventas | `user-story` `backend` `frontend` | <!-- TODO --> |

**Entregables:**
- Módulo de Matrícula con validación de unicidad compuesta
- Módulo de Calificación con cálculo automático de nota definitiva
- Common Module global (filtros, interceptores, pipes)
- Frontend: estructura Next.js, listados y formularios de entidades base

---

### Sprint 4 —  Alertas, integración final y despliegue 

> 📅 **May 11 → May 18** · 🚫 Festivo: May 18 (Día de la Asecension) · <!-- TODO: Agregar enlace al Milestone en GitHub -->

| # | Historia de Usuario | Labels | Issue |
|---|---|---|---|
| HU-09 |  Alerta de Productos con Stock Bajo Mínimo  | `user-story` `backend` `frontend` `infraestructura` `cross-cutting`   | <!-- TODO --> |

**Entregables:**
- For (productos, proveedores, compras, ventas y stock)
## 📅 Cronograma

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    SEGUNDO CORTE (Release 1) — Cierre: 17 Abr 2026          │
│                          Backend + Frontend Base                            │
├─────────────────────┬─────────────────────┬──────────────────────────────────┤
│  Sprint 1           │    Sprint 2         │         Sprint 3                │
│  Mar 16 → Mar 29    │  Mar 30 → Abr 10    │   Abr 13 → Abr 17             │
│                     │                     │                                 │
│ • Docker + Prisma   │ • Asignatura        │ • Matrícula                     │
│ • Estudiante        │ • Período           │ • Calificación                  │
│ • Docente           │ • Asignación Doc    │ • Common Module                 │
│ • Programa          │ • Filters/Pipes     │ • Frontend: listados y forms    │
│                     │                     │                                 │
│ 🚫 Mar 23          │ 🚫 Abr 2-3         │                                 │
│   (San José)        │   (Semana Santa)    │                                 │
├─────────────────────┴─────────────────────┴──────────────────────────────────┤
│                    TERCER CORTE (Release 2) — Cierre: 22 May 2026           │
│                          Integración y Despliegue                           │
├────────────────────────────────────┬─────────────────────────────────────────┤
│        Sprint 4                    │          Sprint 5                      │
│        Abr 20 → May 8             │          May 11 → May 22               │
│                                    │                                        │
│ • Frontend listados completos      │ • Integración de flujos               │
│ • Frontend formularios             │ • Pruebas de integración              │
│ • Navegación y layout              │ • Docker Compose validación           │
│ • Selects dinámicos                │ • README y documentación              │
│                                    │                                        │
│ 🚫 May 1                          │ 🚫 May 18                             │
│   (Día del Trabajo)               │   (Día de la Ascensión)               │
└────────────────────────────────────┴─────────────────────────────────────────┘
```

### Festivos Colombianos (Marzo — Mayo 2026)

| Fecha | Festivo | Sprint Afectado |
|---|---|---|
| Jueves 2 de Abril | Jueves Santo | Sprint 2 |
| Viernes 3 de Abril | Viernes Santo | Sprint 2 |
| Viernes 1 de Mayo | Día del Trabajo | Sprint 3 |
| Lunes 18 de Mayo | Día de la Ascensión | Sprint 4 |

---

## ✅ Definition of Done (DoD)

> 📌 Referencia completa: <!-- TODO: Agregar enlace al Issue de DoD en GitHub -->

Cada Historia de Usuario se considera **terminada** cuando cumple **todos** los siguientes criterios:

### Backend
- [ ] Endpoint(s) implementados con arquitectura en capas: Controller → Service → Repository
- [ ] DTOs con validaciones usando `class-validator` y `class-transformer`
- [ ] Manejo de errores con excepciones HTTP apropiadas (`NotFoundException`, `ConflictException`, `BadRequestException`)
- [ ] Respuestas con formato uniforme (interceptor aplicado)
- [ ] Endpoint probado manualmente con Postman/Thunder Client

### Frontend
- [ ] Página(s) implementada(s) con componentes reutilizables
- [ ] Consumo del API a través de la capa de `services/`
- [ ] Manejo de estados: carga (loading), éxito y error
- [ ] Formularios con validación del lado del cliente
- [ ] Diseño responsivo y navegable

### Infraestructura y Código
- [ ] Código versionado en GitHub con commits descriptivos
- [ ] El servicio funciona correctamente con `docker compose up`
- [ ] No hay errores de consola ni advertencias críticas
- [ ] Las migraciones de Prisma están aplicadas y el esquema es consistente

---

## 📊 Tablero Kanban

El seguimiento del proyecto se realiza mediante un tablero Kanban en GitHub Projects:

🔗 <!-- TODO: Agregar enlace al Tablero Kanban en GitHub Projects -->

El tablero incluye:
- **Columnas:** Todo → In Progress → Done
- **Campos personalizados:** Sprint, Release, Prioridad
- **Vistas:** Board (Kanban), Table, Roadmap

---

## ⚙ Instalación y Ejecución

### Prerrequisitos

- [Docker](https://www.docker.com/products/docker-desktop/) y Docker Compose instalados
- [Git](https://git-scm.com/downloads)

### Clonar el repositorio

```bash
git clone https://github.com/jaquimbayoc7/gestion-academica-sistema-avanzada.git
cd gestion-academica-sistema-avanzada
```

### Configurar variables de entorno

```bash
# Copiar el archivo de ejemplo
cp .env.example .env
```

```env
# .env.example
DB_USER=admin
DB_PASSWORD=admin123
DB_NAME=gestion_academica_avanzada_db
```

### Levantar los servicios

```bash
# Levantar todos los servicios con Docker Compose
docker compose up

# O en modo detached (segundo plano)
docker compose up -d
```

### Acceder a los servicios

| Servicio | URL |
|---|---|
| **Frontend (Next.js)** | [http://localhost:3000](http://localhost:3000) |
| **Backend (NestJS API)** | [http://localhost:3001](http://localhost:3001) |
| **PostgreSQL** | `localhost:5432` |

### Ejecutar migraciones de Prisma

```bash
# Entrar al contenedor del backend
docker compose exec backend sh

# Ejecutar migraciones
npx prisma migrate dev

# Generar el cliente Prisma
npx prisma generate
```

---

## 📎 Enlaces Rápidos

| Recurso | Enlace |
|---|---|
| 📋 Tablero Kanban | <!-- TODO: Agregar enlace --> |
| 📌 Issues (todos) | [Ver Issues ]([https://github.com/Isarb-21/inventario-ferreteria-sistema/issues]) |
| 🏁 Sprint 1 | <!-- TODO: Agregar Milestone --> |
| 🏁 Sprint 2 | <!-- TODO: Agregar Milestone --> |
| 🏁 Sprint 3 | <!-- TODO: Agregar Milestone --> |
| 🏁 Sprint 4 | <!-- TODO: Agregar Milestone --> |
| 📖 Definition of Done | <!-- TODO: Agregar Issue --> |

---

<p align="center">
  <strong>Programación Avanzada — Ingeniería de Sistemas — 2026A</strong><br>
  <em>Corporación Universitaria del Huila — CORHUILA</em>
</p>
