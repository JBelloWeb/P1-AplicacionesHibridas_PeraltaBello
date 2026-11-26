import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { db } from "./db.js"
import { HttpError } from "./errors.js"

const usuarios = db.collection("usuarios")
const SIN_PASSWORD = { projection: { password: 0 } }

usuarios.createIndex({ email: 1 }, { unique: true }).catch((error) =>
    console.error("No se pudo crear el índice de usuarios:", error.message)
)

function sinPassword({ password, ...usuario }) {
    return usuario
}

export async function registrar({ nombre, email, password }, rol = "user") {
    const existe = await usuarios.findOne({ email })
    if (existe) throw new HttpError(409, "Ya existe una cuenta con ese email")

    const usuario = {
        nombre,
        email,
        password: await bcrypt.hash(password, 10),
        rol,
        creadoEn: new Date()
    }
    const result = await usuarios.insertOne(usuario)
    return sinPassword({ ...usuario, _id: result.insertedId })
}

export async function login({ email, password }) {
    const usuario = await usuarios.findOne({ email })
    const valido = usuario && (await bcrypt.compare(password, usuario.password))
    if (!valido) throw new HttpError(401, "Email o contraseña incorrectos")

    const datos = {
        _id: usuario._id.toString(),
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
    }
    const token = jwt.sign(datos, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES ?? "2h"
    })
    return { ...datos, token }
}

export async function getUsuarios() {
    return usuarios.find({}, SIN_PASSWORD).sort({ creadoEn: -1 }).toArray()
}

export async function getUsuarioByEmail(email) {
    return usuarios.findOne({ email }, SIN_PASSWORD)
}

export async function setRol(email, rol) {
    await usuarios.updateOne({ email }, { $set: { rol } })
}
