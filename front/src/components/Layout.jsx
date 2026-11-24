import { Outlet } from "react-router"
import Nav from "./Nav.jsx"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function Layout() {
    return (
        <div className="min-h-screen bg-papel text-tinta font-sans">
            <Nav />
            <main className="mx-auto max-w-6xl px-4 py-8">
                <Outlet />
            </main>
            <ToastContainer
                position="bottom-right"
                theme="light"
                toastClassName="!rounded-2xl !font-sans"
            />
        </div>
    )
}
