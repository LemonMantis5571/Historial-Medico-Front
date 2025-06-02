import { Home, UserIcon, FileText, Calendar, Settings, LogOut, Stethoscope, Users } from "lucide-react"

export default function Sidebar({ user, activeView, onViewChange, onLogout }) {
  const patientMenuItems = [
    { id: "overview", label: "Resumen", icon: Home },
    { id: "profile", label: "Mi Perfil", icon: UserIcon },
    { id: "history", label: "Historial Médico", icon: FileText },
  ]

  const doctorMenuItems = [
    { id: "overview", label: "Dashboard", icon: Home },
    { id: "patients", label: "Pacientes", icon: Users },
    { id: "appointments", label: "Citas", icon: Calendar },
    { id: "profile", label: "Mi Perfil", icon: UserIcon },
  ]

  const menuItems = user.role === "patient" ? patientMenuItems : doctorMenuItems

  return (
    <div className="w-64 bg-white shadow-lg flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Stethoscope size={24} className="text-white" />
          </div>
          <div className="ml-3">
            <h1 className="text-xl font-bold text-gray-900">SMC</h1>
            <p className="text-sm text-gray-500">Sistema Médico</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    activeView === item.id
                      ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Icon size={20} className="mr-3" />
                  {item.label}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <UserIcon size={20} className="text-blue-600" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user.role}</p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut size={16} className="mr-3" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  )
}

