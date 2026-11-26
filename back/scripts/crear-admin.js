import "dotenv/config"
import { registroSchema } from "../schemas/usuarios.js"
import * as usuarioService from "../services/usuarios.service.js"

const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env

const datos = registroSchema.safeParse({
    nombre: "Administrador",
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    confirmPassword: ADMIN_PASSWORD
})

if (!datos.success) {
    console.error("ADMIN_EMAIL / ADMIN_PASSWORD inválidos en el .env:")
    datos.error.issues.forEach((issue) => console.error(` - ${issue.path.join(".")}: ${issue.message}`))
    process.exit(1)
}

const existente = await usuarioService.getUsuarioByEmail(datos.data.email)
if (existente) {
    await usuarioService.setRol(existente.email, "admin")
    console.log(`El usuario ${existente.email} ya existía: ahora es admin.`)
} else {
    await usuarioService.registrar(datos.data, "admin")
    console.log(`Admin creado: ${datos.data.email}`)
}
process.exit(0)
