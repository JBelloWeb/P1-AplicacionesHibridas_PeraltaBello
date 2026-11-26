import "dotenv/config"
import express from "express"
import cors from "cors"
import barriosApiRoutes from "./api/routes/barrios.routes.js"
import clientesApiRoutes from "./api/routes/clientes.routes.js"
import usuariosApiRoutes from "./api/routes/usuarios.routes.js"

const app = express()
const PORT = process.env.PORT ?? 3333

app.use(cors())
app.use(express.json())

app.use(barriosApiRoutes)
app.use(clientesApiRoutes)
app.use(usuariosApiRoutes)

app.use((req, res) => {
    res.status(404).json({ message: "Recurso no encontrado" })
})

app.use((error, req, res, next) => {
    if (error.type === "entity.parse.failed") {
        return res.status(400).json({ message: "El cuerpo de la petición no es un JSON válido" })
    }
    console.error(error)
    res.status(500).json({ message: "Error interno del servidor" })
})

app.listen(PORT, () => console.log(`API Barriopoli en http://localhost:${PORT}/api`))
