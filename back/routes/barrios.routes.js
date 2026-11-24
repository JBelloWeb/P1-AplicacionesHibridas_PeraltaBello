import * as barrioController from "../controllers/barrios.controller.js"
import { Router } from "express"

const router = Router()

router.get("/barrios", barrioController.getBarrios)
router.get("/barrios/comuna/:comuna", barrioController.getBarriosByComuna)
router.get("/barrios/desactivados", barrioController.getBarriosDesactivados)
router.get("/barrios/nuevo", barrioController.newBarrioForm)
router.post("/barrios/nuevo", barrioController.saveBarrio)
router.get("/barrios/editar/:id", barrioController.editBarrioForm)
router.post("/barrios/editar/:id", barrioController.editBarrio)
router.get("/barrios/borrar/:id", barrioController.desactivarBarrioForm)
router.post("/barrios/borrar/:id", barrioController.desactivarBarrio)
router.get("/barrios/activar/:id", barrioController.activarBarrio)
router.get("/barrios/:id", barrioController.getBarrioById)

export default router
