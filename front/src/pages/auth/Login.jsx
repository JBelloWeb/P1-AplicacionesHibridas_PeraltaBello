import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useNavigate } from "react-router"
import { toast } from "react-toastify"
import { loginSchema } from "../../schemas/usuarios.js"
import { useApiUsuarios } from "../../services/usuarios.service.js"
import { useLogin } from "../../context/session.context.jsx"
import Campo from "../../components/Campo.jsx"

export default function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm({ resolver: zodResolver(loginSchema) })

    const api = useApiUsuarios()
    const loginCtx = useLogin()
    const navigate = useNavigate()

    async function onSubmit(datos) {
        try {
            const respuesta = await api.login(datos)
            loginCtx(respuesta)
            navigate("/")
        } catch (err) {
            toast.error(err.message ?? "No se pudo iniciar sesión")
        }
    }

    return (
        <div className="mx-auto max-w-md">
            <h1 className="mb-8 text-center text-3xl font-bold text-violeta-oscuro">Ingresar</h1>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-5 rounded-3xl border border-lila/30 bg-white p-8"
            >
                <Campo
                    label="Email"
                    registro={register("email")}
                    error={errors.email?.message}
                    type="email"
                    placeholder="tu@email.com"
                    autoComplete="email"
                />
                <Campo
                    label="Contraseña"
                    registro={register("password")}
                    error={errors.password?.message}
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                />
                <button type="submit" disabled={isSubmitting} className="btn mt-2 disabled:opacity-50">
                    {isSubmitting ? "Ingresando…" : "Ingresar"}
                </button>
                <p className="text-center text-sm text-tinta/60">
                    ¿No tenés cuenta?{" "}
                    <Link to="/registro" className="font-semibold text-violeta-oscuro hover:text-violeta">
                        Registrate
                    </Link>
                </p>
            </form>
        </div>
    )
}
