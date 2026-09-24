import express from "express"
import barriosRoutes from "./routes/barrios.routes.js"
import clientesRoutes from "./routes/clientes.routes.js"
import barriosApiRoutes from "./api/routes/barrios.routes.js"
import clientesApiRoutes from "./api/routes/clientes.routes.js"

const app = express()

app.use("/", express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(barriosRoutes)
app.use(clientesRoutes)
app.use(barriosApiRoutes)
app.use(clientesApiRoutes)

app.listen(3333, () => console.log("Funcionando...."))
