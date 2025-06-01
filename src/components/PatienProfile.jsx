import { Plus, Edit } from "lucide-react"

export default function PatientProfile({ onLogout }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium text-gray-800">Hola, Paciente 1.</h1>
        <div className="w-16 h-16 bg-sky-200 rounded-full flex items-center justify-center">
          <div className="w-12 h-12 bg-sky-300 rounded-full flex items-center justify-center">
            <div className="w-6 h-6 bg-red-400 rounded-full mb-2"></div>
            <div className="absolute mt-4 w-8 h-6 bg-green-500 rounded-t-full"></div>
          </div>
        </div>
      </div>

      {/* General Information Section */}
      <div className="border-2 border-dotted border-gray-400 rounded-lg p-4 relative">
        <div className="absolute -top-4 left-4 bg-sky-400 text-white px-4 py-2 rounded-full text-sm font-medium">
          Información general
        </div>

        <div className="mt-4 space-y-2 text-gray-700">
          <p>
            <span className="font-medium">Edad:</span> 21
          </p>
          <p>
            <span className="font-medium">Genero:</span> Masculino
          </p>
          <p>
            <span className="font-medium">Contacto:</span> 1234-5678
          </p>
        </div>

        <div className="absolute bottom-4 right-4 flex space-x-2">
          <button className="w-8 h-8 border-2 border-black rounded-lg flex items-center justify-center hover:bg-gray-100">
            <Plus size={16} />
          </button>
          <button className="w-8 h-8 border-2 border-black rounded-lg flex items-center justify-center hover:bg-gray-100">
            <Edit size={16} />
          </button>
        </div>
      </div>

      {/* Medical History Section */}
      <div className="border-2 border-dotted border-gray-400 rounded-lg p-4 relative">
        <div className="absolute -top-4 left-4 bg-sky-400 text-white px-4 py-2 rounded-full text-sm font-medium">
          Historial medico
        </div>

        <div className="mt-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-black">
                <th className="text-left py-2 text-sm font-bold">PACIENTE</th>
                <th className="text-left py-2 text-sm font-bold">FECHA</th>
                <th className="text-left py-2 text-sm font-bold">DIAGNOSTICO</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-black">
                <td className="py-2 text-sm">PACIENTE_1</td>
                <td className="py-2 text-sm">12/12/12</td>
                <td className="py-2 text-sm">GRIPE Y TOS</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="absolute bottom-4 right-4 flex space-x-2">
          <button className="w-8 h-8 border-2 border-black rounded-lg flex items-center justify-center hover:bg-gray-100">
            <Plus size={16} />
          </button>
          <button className="w-8 h-8 border-2 border-black rounded-lg flex items-center justify-center hover:bg-gray-100">
            <Edit size={16} />
          </button>
        </div>
      </div>

      {/* Treatments Section */}
      <div className="border-2 border-dotted border-gray-400 rounded-lg p-4 relative">
        <div className="absolute -top-4 left-4 bg-sky-400 text-white px-4 py-2 rounded-full text-sm font-medium">
          Tratamientos
        </div>

        <div className="mt-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-black">
                <th className="text-left py-2 text-sm font-bold">PACIENTE</th>
                <th className="text-left py-2 text-sm font-bold">FECHA</th>
                <th className="text-left py-2 text-sm font-bold">TRATAMIENTO</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-black">
                <td className="py-2 text-sm">PACIENTE_1</td>
                <td className="py-2 text-sm">12/12/12</td>
                <td className="py-2 text-sm">VIROGRIP</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="absolute bottom-4 right-4 flex space-x-2">
          <button className="w-8 h-8 border-2 border-black rounded-lg flex items-center justify-center hover:bg-gray-100">
            <Plus size={16} />
          </button>
          <button className="w-8 h-8 border-2 border-black rounded-lg flex items-center justify-center hover:bg-gray-100">
            <Edit size={16} />
          </button>
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={onLogout}
        className="w-full bg-red-500 text-white py-2 rounded-lg font-medium hover:bg-red-600 transition-colors mt-6"
      >
        Cerrar Sesión
      </button>
    </div>
  )
}
