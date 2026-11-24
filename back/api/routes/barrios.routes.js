import { Router } from "express"
import * as barrioController from "../controllers/barrios.controller.js"
import { validate, validateQuery } from "../../middlewares/validate.js"
import { validateObjectId } from "../../middlewares/objectId.validate.js"
import { validateToken, validateRol } from "../../middlewares/auth.validate.js"
import { barrioSchema, barrioParcialSchema, filtrosBarrioSchema } from "../../schemas/barrios.js"

const router = Router()

const soloAdmin = [validateToken, validateRol(["admin"])]

// La lectura es pública, salvo ver los barrios dados de baja (?eliminado=true).
function adminSiPideEliminados(req, res, next) {
    if (req.filtros.eliminado !== "true") return next()
    validateToken(req, res, () => validateRol(["admin"])(req, res, next))
}

router.get("/api/barrios", validateQuery(filtrosBarrioSchema), adminSiPideEliminados, barrioController.getBarrios)
router.get("/api/barrios/lineas", barrioController.getLineas)
router.get("/api/barrios/:id", validateObjectId("id"), barrioController.getBarrioById)

router.post("/api/barrios", soloAdmin, validate(barrioSchema), barrioController.saveBarrio)
router.put("/api/barrios/:id", soloAdmin, validateObjectId("id"), validate(barrioSchema), barrioController.replaceBarrio)
router.patch("/api/barrios/:id", soloAdmin, validateObjectId("id"), validate(barrioParcialSchema), barrioController.updateBarrio)
router.delete("/api/barrios/:id", soloAdmin, validateObjectId("id"), barrioController.deleteBarrio)
router.patch("/api/barrios/:id/activar", soloAdmin, validateObjectId("id"), barrioController.activarBarrio)

export default router
