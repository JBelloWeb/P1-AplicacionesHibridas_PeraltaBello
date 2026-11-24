import { Router } from "express"
import * as usuarioController from "../controllers/usuarios.controller.js"
import { validate } from "../../middlewares/validate.js"
import { validateToken, validateRol } from "../../middlewares/auth.validate.js"
import { registroSchema, loginSchema } from "../../schemas/usuarios.js"

const router = Router()

router.post("/api/auth/registro", validate(registroSchema), usuarioController.registro)
router.post("/api/auth/login", validate(loginSchema), usuarioController.login)
router.get("/api/usuarios", validateToken, validateRol(["admin"]), usuarioController.getUsuarios)

export default router
