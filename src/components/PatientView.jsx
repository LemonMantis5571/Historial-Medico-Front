import { useState, useEffect } from "react"
import { Calendar, Phone, UserIcon, Plus, Edit, FileText } from "lucide-react"
import UserModal from "./Modal/UserModal"

export default function PatientView({ user, activeView }) {
    const [medicalHistory, setMedicalHistory] = useState([])
    const [treatments, setTreatments] = useState([])
    const [loading, setLoading] = useState(true)
    const [patientData, setPatientData] = useState(null)

    useEffect(() => {
        getPatientMedicalHistory()
        getPatientPersonalData()
    }, [])

    const getPatientPersonalData = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:5002/patients/${user.id}`);
            if (!response.ok) {
                throw new Error("Failed to fetch fresh patient data");
            }
            const data = await response.json();
            setPatientData(data);
        } catch (error) {
            console.error("Error fetching fresh patient data:", error)
        }
    }

    const getPatientMedicalHistory = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:5002/historial/paciente/${user.id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();


            const formattedData = data ? data.map(record => ({
                ID_Historial: record.ID_Historial,
                Fecha_Creación: record.Fecha_Creación,
                ID_Paciente: record.ID_Paciente,
                nombre_paciente: record.nombre_paciente,
                diagnosticos: record.diagnosticos || null,
                doctorName: record.doctorName || "No especificado"
            })) : [];

            setMedicalHistory(formattedData);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching medical history:", error);
            setMedicalHistory([]);
            setLoading(false);
        }
    }






    if (activeView === "profile") {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">Información Personal</h2>
                        <UserModal user={patientData} onUpdate={getPatientPersonalData} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <UserIcon size={20} className="text-gray-400 mr-3" />
                                <div>
                                    <p className="text-sm text-gray-500">Edad</p>
                                    <p className="font-medium">{patientData.age} años</p>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <UserIcon size={20} className="text-gray-400 mr-3" />
                                <div>
                                    <p className="text-sm text-gray-500">Género</p>
                                    <p className="font-medium">{patientData.gender}</p>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <Phone size={20} className="text-gray-400 mr-3" />
                                <div>
                                    <p className="text-sm text-gray-500">Contacto</p>
                                    <p className="font-medium">{patientData.phone}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="font-medium text-gray-900 mb-2">Información Médica</h3>
                            <p className="text-sm text-gray-600">
                                Tipo de sangre, alergias, medicamentos actuales y otra información médica relevante.
                            </p>
                            <button className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium">
                                Actualizar información médica →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (activeView === "history") {
        return (
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900">Historial Médico</h2>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Fecha
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Diagnóstico
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Doctor
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {medicalHistory.length > 0 ? (
                                    medicalHistory.map((record) => (
                                        <tr key={record.ID_Historial} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {record.Fecha_Creación}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {record.diagnosticos > 0 || "No especificado"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {record.doctorName || "No especificado"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button className="text-blue-600 hover:text-blue-900 mr-3">
                                                    Ver detalles
                                                </button>
                                                <button className="text-gray-600 hover:text-gray-900">
                                                    <Edit size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                                            No se encontraron registros médicos
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Treatments Section - Only show if there are treatments */}
                {treatments.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm mt-6">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900">Tratamientos</h2>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Fecha
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tratamiento
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Doctor
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Estado
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {treatments.map((treatment) => (
                                        <tr key={treatment.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {treatment.date}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {treatment.treatment}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {treatment.doctorName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    Activo
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Overview/Dashboard view
    return (
        <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* Stats Cards */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <FileText size={24} className="text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Consultas</p>
                            <p className="text-2xl font-semibold text-gray-900">{medicalHistory.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Calendar size={24} className="text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Próxima Cita</p>
                            <p className="text-lg font-semibold text-gray-900">15 Ene</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <UserIcon size={24} className="text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Tratamientos</p>
                            <p className="text-2xl font-semibold text-gray-900">{treatments.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
                <div className="space-y-4">
                    {medicalHistory.slice(0, 3).map((record) => (
                        <div key={record.id} className="flex items-center p-4 bg-gray-50 rounded-lg">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <FileText size={16} className="text-blue-600" />
                            </div>
                            <div className="ml-4 flex-1">
                                <p className="text-sm font-medium text-gray-900">{record.diagnosis}</p>
                                <p className="text-sm text-gray-600">
                                    Dr. {record.doctorName} • {record.date}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}