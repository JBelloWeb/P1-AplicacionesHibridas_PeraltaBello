import * as barrioController from "../controllers/barrios.controller.js"
import { Router } from "express"

const router = Router()

router.get("/api/barrios", barrioController.getBarrios)
router.get("/api/barrios/desactivados", barrioController.getBarriosDesactivados)
router.get("/api/barrios/comuna/:comuna", barrioController.getBarriosByComuna)
router.get("/api/barrios/:id", barrioController.getBarrioById)
router.post("/api/barrios", barrioController.saveBarrio)
router.put("/api/barrios/:id", barrioController.replaceBarrio)
router.patch("/api/barrios/:id", barrioController.updateBarrio)
router.delete("/api/barrios/:id", barrioController.deleteBarrio)

export default router
