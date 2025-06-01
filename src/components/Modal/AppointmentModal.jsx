import React, { useState, useEffect } from 'react';
import { Edit, Save, X, Plus, Calendar, Clock, User, FileText } from 'lucide-react';

export default function AppointmentModal({ appointment, onUpdate, mode = 'edit' }) {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        fecha: '',
        hora: '',
        paciente: '',
        motivo: '',
        estado: 'Pendiente'
    });
    const [isLoading, setIsLoading] = useState(false);

    // Estados disponibles para las citas
    const estados = [
        'Pendiente',
        'Confirmada',
        'Urgente',
        'Cancelada',
        'Completada'
    ];

    // Motivos comunes
    const motivosComunes = [
        'Consulta General',
        'Control',
        'Emergencia',
        'Revisión',
        'Diagnóstico',
        'Seguimiento',
        'Vacunación',
        'Exámenes',
        'Otro'
    ];

    useEffect(() => {
        if (appointment && isOpen) {
            setFormData({
                fecha: appointment.fecha || '',
                hora: appointment.hora || '',
                paciente: appointment.paciente || '',
                motivo: appointment.motivo || '',
                estado: appointment.estado || 'Pendiente'
            });
        }
    }, [appointment, isOpen]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            // Simular llamada a API
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            if (onUpdate) {
                await onUpdate(formData);
            }
            
            setIsOpen(false);
        } catch (error) {
            console.error('Error updating appointment:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        // Resetear formulario al cerrar
        if (appointment) {
            setFormData({
                fecha: appointment.fecha || '',
                hora: appointment.hora || '',
                paciente: appointment.paciente || '',
                motivo: appointment.motivo || '',
                estado: appointment.estado || 'Pendiente'
            });
        } else {
            setFormData({
                fecha: '',
                hora: '',
                paciente: '',
                motivo: '',
                estado: 'Pendiente'
            });
        }
        setIsOpen(false);
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            handleClose();
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

    return (
        <>
            {/* Botón trigger */}
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
                    onClick={handleBackdropClick}
                >
                    {/* Modal content */}
                    <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl transform transition-all duration-200 scale-100">
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
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                disabled={isLoading}
                            >
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>

                        {/* Form */}
                        <div className="p-6 space-y-4">
                            {/* Fecha */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Calendar size={16} className="inline mr-1" />
                                    Fecha *
                                </label>
                                <input
                                    type="date"
                                    value={formData.fecha}
                                    onChange={(e) => handleInputChange('fecha', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Hora */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Clock size={16} className="inline mr-1" />
                                    Hora *
                                </label>
                                <input
                                    type="time"
                                    value={formData.hora}
                                    onChange={(e) => handleInputChange('hora', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Paciente */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <User size={16} className="inline mr-1" />
                                    Paciente *
                                </label>
                                <input
                                    type="text"
                                    placeholder="Nombre del paciente"
                                    value={formData.paciente}
                                    onChange={(e) => handleInputChange('paciente', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Motivo */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <FileText size={16} className="inline mr-1" />
                                    Motivo *
                                </label>
                                <select
                                    value={formData.motivo}
                                    onChange={(e) => handleInputChange('motivo', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                                    required
                                    disabled={isLoading}
                                >
                                    <option value="">Seleccionar motivo</option>
                                    {motivosComunes.map((motivo) => (
                                        <option key={motivo} value={motivo}>
                                            {motivo}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Estado */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Estado *
                                </label>
                                <select
                                    value={formData.estado}
                                    onChange={(e) => handleInputChange('estado', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                                    required
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
                                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isLoading || !formData.fecha || !formData.hora || !formData.paciente.trim() || !formData.motivo.trim()}
                                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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