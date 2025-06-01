import { useState } from "react"

import { Stethoscope, UserIcon, Lock, AlertCircle } from "lucide-react"

export default function LoginScreen({ onLogin }) {
    const [userType, setUserType] = useState("doctor")
    const [credentials, setCredentials] = useState({ username: "", password: "" })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {

            //   const response = await fetch("/api/auth/login", {
            //     method: "POST",
            //     headers: {
            //       "Content-Type": "application/json",
            //     },
            //     body: JSON.stringify({
            //       username: credentials.username,
            //       password: credentials.password,
            //       userType: userType,
            //     }),
            //   })

            // if (!response.ok) {
            //     throw new Error("Invalid credentials")
            // }

            //   const data = await response.json()
            const data = {
                token: "mock-token",
            }

            const mockUser = {
                id: userType === "patient" ? "1" : "101",
                name: userType === "patient" ? "Paciente 1" : "Doctor 1",
                type: userType,
                email: credentials.username,
                ...(userType === "patient"
                    ? {
                        age: 21,
                        gender: "Masculino",
                        contact: "1234-5678",
                    }
                    : {
                        age: 25,
                        specialty: "Medico General",
                        contact: "1234-5678",
                    }),
            }

            

            onLogin(mockUser, data.token || "mock-token")
        } catch (err) {
            console.error("Login error:", err)
            setError("Credenciales inválidas. Por favor, intente nuevamente.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 items-center justify-center p-12">
                <div className="text-center text-white">
                    <div className="flex items-center justify-center mb-8">
                        <div className="relative">
                            <Stethoscope size={80} className="text-white" />
                            <div className="absolute -top-2 -right-2 bg-white text-blue-600 rounded-full p-2">
                                <div className="w-4 h-4 flex items-center justify-center text-xs font-bold">+</div>
                            </div>
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold mb-4">SMC</h1>
                    <p className="text-xl opacity-90 mb-8">Sistema Médico Completo</p>
                    <p className="text-lg opacity-75 max-w-md">
                        Gestiona pacientes, historiales médicos y tratamientos de manera eficiente y segura.
                    </p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Bienvenido</h2>
                        <p className="text-gray-600">Inicia sesión en tu cuenta</p>
                    </div>

                    {/* User Type Toggle */}
                    <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
                        <button
                            type="button"
                            onClick={() => setUserType("patient")}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all hover:cursor-pointer ${userType === "patient" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            Paciente
                        </button>
                        <button
                            type="button"
                            onClick={() => setUserType("doctor")}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all hover:cursor-pointer ${userType === "doctor" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            Doctor
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
                            <AlertCircle size={16} className="mr-2" />
                            <span className="text-sm">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
                            <div className="relative">
                                <UserIcon size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    required
                                    value={credentials.username}
                                    onChange={(e) => setCredentials((prev) => ({ ...prev, username: e.target.value }))}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Ingresa tu usuario"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                            <div className="relative">
                                <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="password"
                                    required
                                    value={credentials.password}
                                    onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Ingresa tu contraseña"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
                            ¿Olvidaste tu contraseña?
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

