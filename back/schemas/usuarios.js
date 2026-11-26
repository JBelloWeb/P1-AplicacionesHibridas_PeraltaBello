import { z } from "zod"

const email = z
    .string("El email es obligatorio")
    .trim()
    .toLowerCase()
    .pipe(z.email("El email no es válido"))

export const registroSchema = z
    .object({
        nombre: z
            .string("El nombre es obligatorio")
            .trim()
            .min(3, "El nombre debe tener al menos 3 caracteres")
            .max(60, "El nombre puede tener hasta 60 caracteres"),
        email,
        password: z
            .string("La contraseña es obligatoria")
            .min(8, "La contraseña debe tener al menos 8 caracteres")
            .regex(/[A-Z]/, "La contraseña debe tener una mayúscula")
            .regex(/[a-z]/, "La contraseña debe tener una minúscula")
            .regex(/[0-9]/, "La contraseña debe tener un número")
            .regex(/[^A-Za-z0-9]/, "La contraseña debe tener un carácter especial"),
        confirmPassword: z.string("Confirmá la contraseña")
    })
    .refine((datos) => datos.password === datos.confirmPassword, {
        error: "Las contraseñas no coinciden",
        path: ["confirmPassword"]
    })

export const loginSchema = z.object({
    email,
    password: z.string("La contraseña es obligatoria").min(1, "La contraseña es obligatoria")
})
