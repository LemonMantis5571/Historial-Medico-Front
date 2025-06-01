"use client"


import { Bell, Search } from "lucide-react"

export default function Header({ user }) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Hola, {user.name}</h1>
          <p className="text-gray-600">
            {user.type === "patient" ? "Bienvenido a tu portal de salud" : "Panel de control médico"}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {/* User Avatar */}
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-blue-600">{user.name.charAt(0)}</span>
          </div>
        </div>
      </div>
    </header>
  )
}


