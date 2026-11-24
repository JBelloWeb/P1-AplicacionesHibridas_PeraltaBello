import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router"
import { SessionProvider } from "./context/session.context.jsx"
import Layout from "./components/Layout.jsx"
import ProtectedRoute from "./components/ProtectedRoute.jsx"
import NotFound from "./pages/NotFound.jsx"
import Home from "./pages/Home.jsx"
import Login from "./pages/auth/Login.jsx"
import Registro from "./pages/auth/Registro.jsx"
import Logout from "./pages/auth/Logout.jsx"
import Barrios from "./pages/barrios/Barrios.jsx"
import DetalleBarrio from "./pages/barrios/Detalle.jsx"
import NuevoBarrio from "./pages/barrios/NuevoBarrio.jsx"
import EditarBarrio from "./pages/barrios/EditarBarrio.jsx"
import BorrarBarrio from "./pages/barrios/BorrarBarrio.jsx"
import BarriosDesactivados from "./pages/barrios/Desactivados.jsx"
import Clientes from "./pages/clientes/Clientes.jsx"
import DetalleCliente from "./pages/clientes/DetalleCliente.jsx"
import NuevoCliente from "./pages/clientes/NuevoCliente.jsx"
import EditarCliente from "./pages/clientes/EditarCliente.jsx"
import BorrarCliente from "./pages/clientes/BorrarCliente.jsx"
import Usuarios from "./pages/Usuarios.jsx"
import "./index.css"

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        errorElement: <NotFound />,
        children: [
            { index: true, element: <Home /> },
            { path: "login", element: <Login /> },
            { path: "registro", element: <Registro /> },
            { path: "salir", element: <Logout /> },
            { path: "barrios", element: <Barrios /> },
            {
                path: "barrios/nuevo",
                element: <ProtectedRoute roles={["admin"]}><NuevoBarrio /></ProtectedRoute>
            },
            {
                path: "barrios/desactivados",
                element: <ProtectedRoute roles={["admin"]}><BarriosDesactivados /></ProtectedRoute>
            },
            { path: "barrios/:id", element: <DetalleBarrio /> },
            {
                path: "barrios/:id/editar",
                element: <ProtectedRoute roles={["admin"]}><EditarBarrio /></ProtectedRoute>
            },
            {
                path: "barrios/:id/borrar",
                element: <ProtectedRoute roles={["admin"]}><BorrarBarrio /></ProtectedRoute>
            },
            {
                path: "clientes",
                element: <ProtectedRoute roles={["user", "admin"]}><Clientes /></ProtectedRoute>
            },
            {
                path: "clientes/nuevo",
                element: <ProtectedRoute roles={["admin"]}><NuevoCliente /></ProtectedRoute>
            },
            {
                path: "clientes/:id",
                element: <ProtectedRoute roles={["user", "admin"]}><DetalleCliente /></ProtectedRoute>
            },
            {
                path: "clientes/:id/editar",
                element: <ProtectedRoute roles={["admin"]}><EditarCliente /></ProtectedRoute>
            },
            {
                path: "clientes/:id/borrar",
                element: <ProtectedRoute roles={["admin"]}><BorrarCliente /></ProtectedRoute>
            },
            {
                path: "usuarios",
                element: <ProtectedRoute roles={["admin"]}><Usuarios /></ProtectedRoute>
            },
            { path: "*", element: <NotFound /> }
        ]
    }
])

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <SessionProvider>
            <RouterProvider router={router} />
        </SessionProvider>
    </StrictMode>
)
