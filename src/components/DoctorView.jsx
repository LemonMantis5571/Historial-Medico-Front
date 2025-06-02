"use client"

import { useState, useEffect } from "react"
import { Users, Calendar, FileText, Plus, Search } from "lucide-react"
import ProfessionalModal from "./Modal/DoctorModal"
import AppointmentModal from "./Modal/AppointmentModal"
import PatientModal from "./Modal/PatientModal"
import PatientHistoryModal from "./Modal/PatientHistoryModal"
import AddDiagnosisModal from "./Modal/AddDiagnosisModal"

function formatTime(timeString) {
    if (!timeString) return '';

    try {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    } catch {
        return timeString;
    }
}

export default function DoctorView({ user, activeView }) {
    console.log("DoctorView rendered with user:", user)
    const [patients, setPatients] = useState([])
    const [loading, setLoading] = useState(true)
    const [appointments, setAppointments] = useState([])
    const [medic, setMedic] = useState([])

    useEffect(() => {
        fetchAppointments()
        fetchPatients()
        fetchDoctorData()
    }, [])

    const fetchPatients = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://127.0.0.1:5002/medicos/${user.ID_Doctor}/pacientes`);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log("Fetched patients for doctor:", user.ID_Doctor, data.patients);
            console.log("DataAAAAAAAAAAAAAAAAA:", data)
            setPatients(data.patients || []);
        }
        catch (error) {
            console.error("Error fetching doctor data:", error.message);
        } finally {
            setLoading(false);
        }
    }

    const fetchDoctorData = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:5002/medicos/${user.ID_Doctor}`);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }
            console.log("Fetching doctor data for user:", user.ID_Doctor)
            const data = await response.json();
            setMedic(data.medico || []);
        } catch (error) {
            console.error("Error fetching doctor data:", error.message);


        }
    }

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://127.0.0.1:5002/citas/medico/${user.ID_Doctor}`);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setAppointments(data.citas || []);

        } catch (error) {
            console.error("Error fetching appointments:", error.message);
            // Optionally show error to user
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    const handleCancelAppointment = async (appointmentId) => {
        if (!window.confirm('¿Estás seguro de que deseas cancelar esta cita?')) {
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`http://127.0.0.1:5002/citas/${appointmentId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to cancel appointment');
            }

            const result = await response.json();
            console.log('Appointment canceled:', result);

            // Refresh the appointments list
            fetchAppointments();

            // Show success message
            toast.success('Cita cancelada exitosamente');

        } catch (error) {
            console.error('Error canceling appointment:', error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };




    if (activeView === "patients") {
        return (
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900">Mis Pacientes</h2>
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Buscar paciente..."
                                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Paciente
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Edad
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Contacto
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Genero
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Acciones
                                    </th>

                                    
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {patients.map((patient) => (
                                    <tr key={patient.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <span className="text-sm font-medium text-blue-600">{patient.name.charAt(0)}</span>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                                                    <div className="text-sm text-gray-500">{patient.gender}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.age} años</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.phone}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.gender}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                Activo
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-lg flex gap-4">
                                            <PatientHistoryModal
                                                patient={patient}
                                                patientId={patient.patientId}
                                                onUpdate={fetchPatients}
                                            />
                                            <AddDiagnosisModal
                                                patientId={patient.patientId}
                                                onUpdate={fetchPatients}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }

    if (activeView === "profile") {
        console.log("Rendering profile view with user:", medic)
        return (
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">Información Profesional</h2>
                        <ProfessionalModal professional={user} onUpdate={fetchDoctorData} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500">Especialidad</p>
                                <p className="font-medium">{medic.specialty}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Contacto</p>
                                <p className="font-medium">{medic.phone}</p>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="font-medium text-gray-900 mb-2">Estadísticas</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Pacientes Activos</span>
                                    <span className="text-sm font-medium">{patients.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Consultas Este Mes</span>
                                    <span className="text-sm font-medium">{appointments.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (activeView === "appointments") {
        return (
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900">Citas Médicas</h2>
                            <AppointmentModal
                                user={user}
                                mode="create"
                                appointment={null}
                                onUpdate={fetchAppointments}
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="p-6 flex justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Fecha
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Hora
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Paciente
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Teléfono
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Estado
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {appointments.length > 0 ? (
                                        appointments.map((cita) => (
                                            <tr key={cita.ID_Cita} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {cita.Fecha}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {formatTime(cita.Hora)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                            <span className="text-xs font-medium text-blue-600">
                                                                {cita.nombre_paciente.charAt(0)}
                                                            </span>
                                                        </div>
                                                        <div className="ml-3">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {cita.nombre_paciente}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {cita.Teléfono}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${cita.Estado === 'Confirmada' ? 'bg-green-100 text-green-800' :
                                                            cita.Estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                                                                cita.Estado === 'Urgente' ? 'bg-red-100 text-red-800' :
                                                                    cita.Estado === 'Cancelada' ? 'bg-gray-100 text-gray-800' :
                                                                        'bg-blue-100 text-blue-800'
                                                        }`}>
                                                        {cita.Estado}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-4">
                                                    <AppointmentModal
                                                        user={user}
                                                        mode="edit"
                                                        appointment={cita}
                                                        onUpdate={fetchAppointments}
                                                    />
                                                    <button
                                                        className="text-red-600 hover:text-red-900"
                                                        onClick={() => handleCancelAppointment(cita.ID_Cita)}
                                                    >
                                                        Cancelar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                                                No hay citas programadas
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        )
    }


    // Overview/Dashboard view
    return (
        <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Stats Cards */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Users size={24} className="text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Pacientes</p>
                            <p className="text-2xl font-semibold text-gray-900">{patients.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Calendar size={24} className="text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Citas Hoy</p>
                            <p className="text-2xl font-semibold text-gray-900">8</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <FileText size={24} className="text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Consultas</p>
                            <p className="text-2xl font-semibold text-gray-900">156</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <Calendar size={24} className="text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Pendientes</p>
                            <p className="text-2xl font-semibold text-gray-900">3</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Patients */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pacientes Recientes</h3>
                <div className="space-y-4">
                    {patients.slice(0, 5).map((patient) => (
                        <div key={patient.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-medium text-blue-600">{patient.name.charAt(0)}</span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-900">{patient.name}</p>
                                    <p className="text-sm text-gray-600">Última visita: {patient.lastVisit}</p>
                                </div>
                            </div>
                            <PatientHistoryModal
                                patient={patient}
                                patientId={patient.patientId}
                                onUpdate={fetchPatients}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}