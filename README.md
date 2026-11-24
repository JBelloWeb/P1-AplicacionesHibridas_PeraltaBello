# Barriopoli — Parcial 2 · Aplicaciones Híbridas

CRUD de barrios y clientes de la Ciudad de Buenos Aires. Stack MERN: Express API REST con autenticación JWT y un frontend React (Vite) que la consume.

**Autores:** Peralta & Bello · Materia: Aplicaciones Híbridas

---

## Stack

| Capa | Tecnología |
|---|---|
| Runtime | Node.js |
| Backend | Express 5 · MongoDB Atlas (driver v7) · bcrypt · jsonwebtoken · Zod 4 |
| Frontend | React 19 · Vite 6 · Tailwind CSS v4 · react-router v7 · react-hook-form · Zod 4 |
| Auth | JWT Bearer · roles `user` / `admin` |

---

## Estructura

```
├── back/           API REST Express
│   ├── api/        routes + controllers
│   ├── middlewares/
│   ├── schemas/    validación Zod
│   ├── scripts/    crear-admin.js
│   ├── services/   lógica + conexión a MongoDB
│   ├── .env.example
│   └── requests.http
└── front/          SPA React + Vite
    ├── src/
    │   ├── components/
    │   ├── context/    SessionContext (JWT)
    │   ├── hooks/      useFetch
    │   ├── pages/
    │   ├── schemas/    validación Zod (igual al back)
    │   └── services/   call() + useApi*()
    └── .env.example
```

---

## Requisitos

- Node.js ≥ 20
- pnpm ≥ 8
- Acceso a un cluster MongoDB Atlas (el `.env` con la URI se entrega aparte)

---

## Configuración

### Back

```bash
cd back
cp .env.example .env   # completar MONGO_URI, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
pnpm install
pnpm run crear-admin   # crea el usuario admin una sola vez
pnpm dev               # http://localhost:3333/api
```

### Front

```bash
cd front
cp .env.example .env.development   # completar VITE_API_URL=http://localhost:3333/api
pnpm install
pnpm dev               # http://localhost:5173
```

> Los archivos `.env` **no se suben al repo** — se entregan aparte según la consigna.

---

## Variables de entorno

### `back/.env`

| Variable | Descripción | Ejemplo |
|---|---|---|
| `PORT` | Puerto del servidor | `3333` |
| `MONGO_URI` | URI de conexión a Atlas | `mongodb+srv://...` |
| `DB_NAME` | Nombre de la base de datos | `barriopoli` |
| `JWT_SECRET` | Clave para firmar tokens | cadena larga y aleatoria |
| `JWT_EXPIRES` | Duración del token | `2h` |
| `ADMIN_EMAIL` | Email del admin inicial | `admin@barriopoli.com` |
| `ADMIN_PASSWORD` | Password del admin inicial (cumple las reglas de Zod) | `Admin123!` |

### `front/.env.development`

| Variable | Descripción | Ejemplo |
|---|---|---|
| `VITE_API_URL` | URL base de la API (sin `/` final) | `http://localhost:3333/api` |

---

## Endpoints

### Auth

| Método | URI | Protección | Respuesta |
|---|---|---|---|
| POST | `/api/auth/registro` | — | 201 usuario sin password |
| POST | `/api/auth/login` | — | 200 `{ token, _id, nombre, email, rol }` |
| GET | `/api/usuarios` | token + admin | 200 lista |

### Barrios

| Método | URI | Protección | Notas |
|---|---|---|---|
| GET | `/api/barrios` | pública | filtros: `q`, `comuna`, `linea`, `orden` |
| GET | `/api/barrios?eliminado=true` | token + admin | barrios dados de baja |
| GET | `/api/barrios/lineas` | pública | valores distintos de transporte |
| GET | `/api/barrios/:id` | pública | incluye cliente asociado |
| POST | `/api/barrios` | token + admin | crea barrio |
| PUT | `/api/barrios/:id` | token + admin | reemplaza barrio |
| PATCH | `/api/barrios/:id` | token + admin | actualización parcial |
| DELETE | `/api/barrios/:id` | token + admin | baja lógica |
| PATCH | `/api/barrios/:id/activar` | token + admin | reactiva |

### Clientes

| Método | URI | Protección | Notas |
|---|---|---|---|
| GET | `/api/clientes` | token + user/admin | lista con `cantidad_barrios` |
| GET | `/api/clientes/:id` | token + user/admin | detalle |
| POST | `/api/clientes` | token + admin | crea cliente |
| PUT | `/api/clientes/:id` | token + admin | reemplaza |
| PATCH | `/api/clientes/:id` | token + admin | actualización parcial |
| DELETE | `/api/clientes/:id` | token + admin | borra y libera barrios |
| GET | `/api/clientes/:id/barrios` | token + user/admin | barrios del cliente |
| PUT | `/api/clientes/:id/barrios/:barrioId` | token + admin | asocia barrio |
| DELETE | `/api/clientes/:id/barrios/:barrioId` | token + admin | desasocia barrio |

> Los errores de validación responden `400 { message, errores: [{ campo, mensaje }] }`.
> Sin token o token inválido → `401`. Sin el rol requerido → `403`. Recurso no encontrado → `404`.

---

## Recorrido de prueba

1. `http://localhost:5173` → mapa de CABA → clic en una comuna → lista filtrada
2. **Registro** con password débil → errores en el form
3. **Registro** con `Vecina123!` → toast → **Login** → Nav muestra nombre
4. `/clientes` sin sesión → redirige a `/login`
5. Login como **admin** → aparecen botones de ABM en barrios y clientes
6. Crear barrio → ver detalle → editar → desactivar → reactivar desde `/barrios/desactivados`
7. Crear cliente → asociar barrio (solo barrios sin cliente) → quitar barrio
8. Ver `/usuarios` → tabla de solo lectura
9. Salir → Nav vuelve a "Ingresar / Registrarse"

---

## Colección de peticiones

`back/requests.http` — compatible con la extensión REST Client de VS Code.
Instrucciones: ejecutar "Login admin", copiar el token en `@tokenAdmin` y probar los endpoints.
