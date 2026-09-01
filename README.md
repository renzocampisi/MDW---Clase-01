# MDW - Clase 01

Servidor Express con TypeScript hecho para la materia MDW.

## Contenido

- `express-server/`: servidor Node.js con Express, TypeScript, CORS y conexión a MongoDB (Mongoose). Expone las rutas `/` y `/health`.

## Uso

```bash
cd express-server
npm install
npm run dev
```

El servidor levanta en `http://localhost:3000` (puerto configurable con la variable `PORT` en `.env`, ver `.env.example`).

### Base de datos

El server necesita `MONGODB_URI` en `express-server/.env` para poder arrancar (si no conecta a Mongo, el proceso corta con un error en vez de quedar escuchando a medias). Opciones:

- **MongoDB Atlas** (recomendado, no requiere instalar nada): creá un cluster gratis (M0) y usá la connection string de **Connect → Drivers**.
- **Docker local**: `docker compose up -d` dentro de `express-server/` (usa el `docker-compose.yml` del repo) con `MONGODB_URI=mongodb://localhost:27017/express-server`.

> **Troubleshooting:** si al conectar a Atlas ves el error `querySrv ECONNREFUSED _mongodb._tcp....`, es porque el resolver DNS de Node no puede resolver el registro SRV (pasa en algunas redes/VPNs), no un problema de credenciales. Solución: usar el formato de conexión **sin SRV**, apuntando directo a los 3 nodos del shard en vez del hostname corto. Podés sacar esos hosts así:
> ```bash
> nslookup -type=SRV _mongodb._tcp.<tu-cluster>.mongodb.net
> nslookup -type=TXT <tu-cluster>.mongodb.net
> ```
> y armar la URI como:
> ```
> mongodb://<user>:<password>@host-shard-00-00...:27017,host-shard-00-01...:27017,host-shard-00-02...:27017/<db>?ssl=true&authSource=admin&replicaSet=<el-de-TXT>&retryWrites=true&w=majority
> ```
