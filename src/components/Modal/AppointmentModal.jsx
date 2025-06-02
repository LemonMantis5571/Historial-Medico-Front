import React, { useState, useEffect } from 'react';
import { Edit, Save, X, Plus, Calendar, Clock, User } from 'lucide-react';

export default function AppointmentModal({ user, appointment, onUpdate, mode = 'edit' }) {
    console.log('AppointmentModal rendered with mode:', mode, 'and appointment:', appointment);
    const [isOpen, setIsOpen] = useState(false);
    const [patients, setPatients] = useState([]);
    const [formData, setFormData] = useState({
        fecha: '',
        hora: '',
        pacienteId: '',
        medicoId: user?.ID_Doctor || 1,
        estado: 'Pendiente'
    });
    const [isLoading, setIsLoading] = useState(false);

    const estados = ['Pendiente', 'Confirmada', 'Urgente', 'Cancelada', 'Completada'];


    useEffect(() => {
        fetch('http://127.0.0.1:5002/pacientes')
            .then(res => res.json())
            .then(data => setPatients(data))
            .catch(err => console.error('Error fetching patients:', err));
    }, []);

  
    useEffect(() => {
        if (appointment && isOpen) {
            setFormData({
                fecha: appointment.fecha || '',
                hora: appointment.hora || '',
                pacienteId: appointment.pacienteId || '',
                medicoId: appointment.medicoId || user?.ID_Doctor || 1,
                estado: appointment.estado || 'Pendiente'
            });
        }
    }, [appointment, isOpen, user]);

    const handleSave = async () => {
        setIsLoading(true);
        
        const endpoint = mode === 'create' 
            ? 'http://127.0.0.1:5002/citas' 
            : `http://127.0.0.1:5002/citas/${appointment.ID_Cita}`;
        
        const method = mode === 'create' ? 'POST' : 'PUT';

        try {
            const response = await fetch(endpoint, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fecha: formData.fecha,
                    hora: formData.hora + ':00', // Add seconds for backend
                    id_paciente: formData.pacienteId,
                    id_medico: formData.medicoId,
                    estado: formData.estado
                })
            });

            if (!response.ok) throw new Error('Error saving appointment');

            const data = await response.json();
            if (onUpdate) await onUpdate(data);
            setIsOpen(false);
            
            // Reset form for new appointments
            if (mode === 'create') {
                setFormData({
                    fecha: '',
                    hora: '',
                    pacienteId: '',
                    medicoId: user?.ID_Doctor || 1,
                    estado: 'Pendiente'
                });
            }
        } catch (error) {
            console.error('Error saving appointment:', error);
            alert('Error al guardar la cita');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        // Reset form if creating new appointment
        if (mode === 'create') {
            setFormData({
                fecha: '',
                hora: '',
                pacienteId: '',
                medicoId: user?.ID_Doctor || 1,
                estado: 'Pendiente'
            });
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'Pendiente': 'bg-yellow-100 text-yellow-800',
            'Confirmada': 'bg-green-100 text-green-800',
            'Urgente': 'bg-red-100 text-red-800',
            'Cancelada': 'bg-gray-100 text-gray-800',
            'Completada': 'bg-blue-100 text-blue-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const isNewAppointment = mode === 'create' || !appointment;
    const isFormValid = formData.fecha && formData.hora && formData.pacienteId;

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    isNewAppointment
                        ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-300'
                }`}
            >
                {isNewAppointment ? (
                    <>
                        <Plus size={16} className="mr-2" />
                        Nueva Cita
                    </>
                ) : (
                    <>
                        <Edit size={16} className="mr-2" />
                        Editar
                    </>
                )}
            </button>

            {/* Modal */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4  bg-opacity-50 backdrop-blur-sm"
                    onClick={(e) => e.target === e.currentTarget && handleClose()}
                >
                    <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div className="flex items-center">
                                <Calendar className="text-blue-600 mr-3" size={24} />
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        {isNewAppointment ? 'Nueva Cita Médica' : 'Editar Cita Médica'}
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {isNewAppointment ? 'Programa una nueva cita' : 'Actualiza los datos de la cita'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                                disabled={isLoading}
                            >
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>

                        {/* Form */}
                        <div className="p-6 space-y-4">
                            {/* Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Calendar size={16} className="inline mr-1" />
                                    Fecha *
                                </label>
                                <input
                                    type="date"
                                    value={formData.fecha}
                                    onChange={(e) => setFormData(prev => ({ ...prev, fecha: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Time */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Clock size={16} className="inline mr-1" />
                                    Hora *
                                </label>
                                <input
                                    type="time"
                                    value={formData.hora}
                                    onChange={(e) => setFormData(prev => ({ ...prev, hora: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Patient */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <User size={16} className="inline mr-1" />
                                    Paciente *
                                </label>
                                <select
                                    value={formData.pacienteId}
                                    onChange={(e) => setFormData(prev => ({ ...prev, pacienteId: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={isLoading}
                                >
                                    <option value="">Seleccione un paciente</option>
                                    {patients.map((patient) => (
                                        <option key={patient.ID_Paciente} value={patient.ID_Paciente}>
                                            {patient.Nombre} - {patient.Teléfono} ({patient.Género})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Estado *
                                </label>
                                <select
                                    value={formData.estado}
                                    onChange={(e) => setFormData(prev => ({ ...prev, estado: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={isLoading}
                                >
                                    {estados.map((estado) => (
                                        <option key={estado} value={estado}>
                                            {estado}
                                        </option>
                                    ))}
                                </select>
                                {formData.estado && (
                                    <div className="mt-2">
                                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(formData.estado)}`}>
                                            {formData.estado}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                            <button
                                onClick={handleClose}
                                disabled={isLoading}
                                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isLoading || !isFormValid}
                                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                        {isNewAppointment ? 'Creando...' : 'Guardando...'}
                                    </>
                                ) : (
                                    <>
                                        <Save size={16} className="mr-2" />
                                        {isNewAppointment ? 'Crear Cita' : 'Guardar Cambios'}
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