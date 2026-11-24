import * as clienteController from "../controllers/clientes.controller.js"
import { Router } from "express"

const router = Router()

router.get("/api/clientes", clienteController.getClientes)
router.post("/api/clientes", clienteController.saveCliente)
router.get("/api/clientes/:id/barrios", clienteController.getBarriosByClienteId)

export default router
