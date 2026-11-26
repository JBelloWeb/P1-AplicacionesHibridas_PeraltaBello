import { Router } from "express"
import * as clienteController from "../controllers/clientes.controller.js"
import { validate } from "../../middlewares/validate.js"
import { validateObjectId } from "../../middlewares/objectId.validate.js"
import { validateToken, validateRol } from "../../middlewares/auth.validate.js"
import { clienteSchema, clienteParcialSchema } from "../../schemas/clientes.js"

const router = Router()

const conSesion = [validateToken, validateRol(["user", "admin"])]
const soloAdmin = [validateToken, validateRol(["admin"])]
const idCliente = validateObjectId("id")
const idClienteYBarrio = validateObjectId("id", "barrioId")

router.get("/api/clientes", conSesion, clienteController.getClientes)
router.get("/api/clientes/:id", conSesion, idCliente, clienteController.getClienteById)
router.post("/api/clientes", soloAdmin, validate(clienteSchema), clienteController.saveCliente)
router.put("/api/clientes/:id", soloAdmin, idCliente, validate(clienteSchema), clienteController.replaceCliente)
router.patch("/api/clientes/:id", soloAdmin, idCliente, validate(clienteParcialSchema), clienteController.updateCliente)
router.delete("/api/clientes/:id", soloAdmin, idCliente, clienteController.deleteCliente)

router.get("/api/clientes/:id/barrios", conSesion, idCliente, clienteController.getBarriosByClienteId)
router.put("/api/clientes/:id/barrios/:barrioId", soloAdmin, idClienteYBarrio, clienteController.asociarBarrio)
router.delete("/api/clientes/:id/barrios/:barrioId", soloAdmin, idClienteYBarrio, clienteController.desasociarBarrio)

export default router
