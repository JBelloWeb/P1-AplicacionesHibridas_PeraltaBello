import { Link } from "react-router"

export default function NotFound() {
    return (
        <div className="flex flex-col items-center gap-6 py-24 text-center">
            <p className="text-7xl font-bold text-violeta/30">404</p>
            <p className="text-xl font-semibold text-violeta-oscuro">Esta página no existe.</p>
            <Link to="/" className="btn">Volver al inicio</Link>
        </div>
    )
}
