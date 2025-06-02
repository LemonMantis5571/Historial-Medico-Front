import React, { useState, useEffect } from 'react';
import { X, Plus, Calendar, FileText, Save } from 'lucide-react';

export default function AddDiagnosisModal({ patientId, historialId }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [loadingAppointments, setLoadingAppointments] = useState(false);
    const [formData, setFormData] = useState({
        descripcion: '',
        fecha: new Date().toISOString().split('T')[0],
        id_cita: ''
    });

    // Fetch appointments for the patient
    const fetchPatientAppointments = async () => {
        if (!patientId) return;

        setLoadingAppointments(true);
        try {
            // Use the new endpoint to get appointments by patient ID
            console.log(`Fetching appointments for patient ID: ${patientId}`);
            const response = await fetch(`http://127.0.0.1:5002/citas/paciente/${patientId}`);

            if (!response.ok) {
                throw new Error('Error al cargar las citas');
            }

            const data = await response.json();
            console.log('Fetched appointments:', data);
            if (data.success && data.citas) {
                // Filter for appointments that can have diagnoses (completed or in progress)

                setAppointments(data.citas);
            } else {
                setAppointments([]);
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
            setAppointments([]);
        } finally {
            setLoadingAppointments(false);
        }
    };

    const handleOpenModal = () => {
        setIsOpen(true);
        fetchPatientAppointments();
    };

    const handleCloseModal = () => {
        setIsOpen(false);
        setFormData({
            descripcion: '',
            fecha: new Date().toISOString().split('T')[0],
            id_cita: ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');

            // Validate that appointment is selected (now required)
            if (!formData.id_cita) {
                throw new Error('Debe seleccionar una cita para vincular el diagnóstico');
            }

            const payload = {
                id_paciente: parseInt(patientId), // Ensure this is an integer
                descripcion: formData.descripcion,
                fecha: formData.fecha,
                id_cita: parseInt(formData.id_cita)
            };

            console.log('Submitting diagnosis:', payload);

            const response = await fetch('http://127.0.0.1:5002/diagnosticos/crear', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Error al crear el diagnóstico');
            }

            handleCloseModal();
            alert('Diagnóstico creado exitosamente y vinculado a la cita');

        } catch (error) {
            console.error('Error creating diagnosis:', error);
            alert('Error al crear el diagnóstico: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            handleCloseModal();
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (timeString) => {
        if (!timeString) return '';
        // Handle both HH:MM:SS and HH:MM formats
        const timeParts = timeString.split(':');
        return `${timeParts[0]}:${timeParts[1]}`;
    };

    const getStatusColor = (status) => {
        const colors = {
            'Programada': 'text-blue-600 bg-blue-100',
            'Confirmada': 'text-green-600 bg-green-100',
            'Completada': 'text-gray-600 bg-gray-100',
            'En Proceso': 'text-yellow-600 bg-yellow-100',
            'Cancelada': 'text-red-600 bg-red-100'
        };
        return colors[status] || 'text-gray-600 bg-gray-100';
    };

    const isFormValid = formData.descripcion.trim() && formData.id_cita;

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={handleOpenModal}
                className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-sm"
            >
                <Plus size={14} className="mr-1" />
                Agregar Diagnóstico
            </button>

            {/* Modal */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-60 flex items-center justify-center p-4  bg-opacity-50 backdrop-blur-sm"
                    onClick={handleBackdropClick}
                >
                    <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl transform transition-all duration-200 scale-100">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                    <FileText size={20} className="text-green-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Nuevo Diagnóstico
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        Crear diagnóstico vinculado a una cita específica
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleCloseModal}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                disabled={isLoading}
                            >
                                <X size={18} className="text-gray-500" />
                            </button>
                        </div>

                        {/* Form */}
                        <div className="p-6 space-y-5">
                            {/* Appointment Selection - Now Required */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Seleccionar Cita *
                                </label>
                                {loadingAppointments ? (
                                    <div className="flex items-center py-3 text-sm text-gray-500 border border-gray-300 rounded-lg px-3">
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-600 border-t-transparent mr-2"></div>
                                        Cargando citas disponibles...
                                    </div>
                                ) : (
                                    <>
                                        <select
                                            value={formData.id_cita}
                                            onChange={(e) => setFormData(prev => ({ ...prev, id_cita: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                                            disabled={isLoading}
                                            required
                                        >
                                            <option value="">Seleccione una cita...</option>
                                            {appointments.map((appointment) => (
                                                <option key={appointment.ID_Cita} value={appointment.ID_Cita}>
                                                    Cita #{appointment.ID_Cita} - {appointment.Fecha} {appointment.Hora} - Dr. {appointment.Medico} ({appointment.Estado})
                                                </option>
                                            ))}
                                        </select>
                                        {appointments.length === 0 && (
                                            <p className="text-xs text-amber-600 mt-1 bg-amber-50 p-2 rounded">
                                                ⚠️ No se encontraron citas disponibles para este paciente. Debe crear una cita primero.
                                            </p>
                                        )}
                                        {formData.id_cita && (
                                            <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                                                {(() => {
                                                    const selectedAppointment = appointments.find(apt => apt.ID_Cita.toString() === formData.id_cita);
                                                    return selectedAppointment ? (
                                                        <div className="text-sm">
                                                            <p className="font-medium text-blue-900">Cita seleccionada:</p>
                                                            <div className="mt-1 space-y-1 text-blue-700">
                                                                <p>📅 {selectedAppointment.Fecha} a las {selectedAppointment.Hora}</p>
                                                                <p>👨‍⚕️ Dr. {selectedAppointment.Medico} - {selectedAppointment.Especialidad}</p>
                                                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedAppointment.Estado)}`}>
                                                                    {selectedAppointment.Estado}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ) : null;
                                                })()}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Descripción del Diagnóstico *
                                </label>
                                <textarea
                                    value={formData.descripcion}
                                    onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                                    placeholder="Ingrese la descripción detallada del diagnóstico..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200 resize-vertical min-h-[120px]"
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Fecha del Diagnóstico
                                </label>
                                <input
                                    type="date"
                                    value={formData.fecha}
                                    onChange={(e) => setFormData(prev => ({ ...prev, fecha: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                disabled={isLoading}
                                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                disabled={isLoading || !isFormValid || appointments.length === 0}
                                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                        Creando...
                                    </>
                                ) : (
                                    <>
                                        <Save size={16} className="mr-2" />
                                        Crear Diagnóstico
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}