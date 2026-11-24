import * as clienteController from "../controllers/clientes.controller.js"
import { Router } from "express"

const router = Router()

router.get("/clientes", clienteController.getClientes)
router.get("/clientes/nuevo", clienteController.newClienteForm)
router.post("/clientes/nuevo", clienteController.saveCliente)
router.get("/clientes/editar/:id", clienteController.editClienteForm)
router.post("/clientes/editar/:id", clienteController.editCliente)
router.post("/clientes/:id/asociar", clienteController.asociarBarrio)
router.post("/clientes/:id/desasociar", clienteController.desasociarBarrio)
router.get("/clientes/:id", clienteController.getClienteById)

export default router
