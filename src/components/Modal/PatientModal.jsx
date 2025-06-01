import React, { useState, useEffect } from 'react';
import { Edit, Save, X, Plus, User, Phone, Calendar, Users } from 'lucide-react';

export default function PatientModal({ patient, onUpdate, mode = 'edit' }) {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        nombre: '',
        fechaNacimiento: '',
        genero: '',
        telefono: ''
    });
    const [isLoading, setIsLoading] = useState(false);


    const generos = [
        'Masculino',
        'Femenino'
    ];

    useEffect(() => {
        if (patient && isOpen) {
            setFormData({
                nombre: patient.nombre || '',
                fechaNacimiento: patient.fechaNacimiento || '',
                genero: patient.genero || '',
                telefono: patient.telefono || ''
            });
        }
    }, [patient, isOpen]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {

            await new Promise(resolve => setTimeout(resolve, 1000));

            if (onUpdate) {
                await onUpdate();
            }

            setIsOpen(false);
        } catch (error) {
            console.error('Error updating patient:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {

        if (patient) {
            setFormData({
                nombre: patient.nombre || '',
                fechaNacimiento: patient.fechaNacimiento || '',
                genero: patient.genero || '',
                telefono: patient.telefono || ''
            });
        } else {
            setFormData({
                nombre: '',
                fechaNacimiento: '',
                genero: '',
                telefono: ''
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
            'Activo': 'bg-green-100 text-green-800',
            'Inactivo': 'bg-gray-100 text-gray-800',
            'Pendiente': 'bg-yellow-100 text-yellow-800',
            'Suspendido': 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const isNewPatient = mode === 'create' || !patient;

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${isNewPatient
                    ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-300'
                    }`}
            >
                {isNewPatient ? (
                    <>
                        <Plus size={16} className="mr-2" />
                        Nuevo Paciente
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
                    <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl transform transition-all duration-200 scale-100">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div className="flex items-center">
                                <User className="text-blue-600 mr-3" size={24} />
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        {isNewPatient ? 'Nuevo Paciente' : 'Editar Paciente'}
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {isNewPatient ? 'Registra un nuevo paciente' : 'Actualiza la información del paciente'}
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

                        <div className="p-6 space-y-4">

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <User size={16} className="inline mr-1" />
                                    Nombre Completo *
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ej: Juan Pérez García"
                                    value={formData.nombre}
                                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Calendar size={16} className="inline mr-1" />
                                    Fecha de Nacimiento *
                                </label>
                                <input
                                    type="date"
                                    value={formData.fechaNacimiento}
                                    onChange={(e) => handleInputChange('fechaNacimiento', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Users size={16} className="inline mr-1" />
                                    Género *
                                </label>
                                <select
                                    value={formData.genero}
                                    onChange={(e) => handleInputChange('genero', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                                    required
                                    disabled={isLoading}
                                >
                                    <option value="">Seleccionar género</option>
                                    {generos.map((genero) => (
                                        <option key={genero} value={genero}>
                                            {genero}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Phone size={16} className="inline mr-1" />
                                    Teléfono *
                                </label>
                                <input
                                    type="tel"
                                    placeholder="Ej: 1234-5678"
                                    value={formData.telefono}
                                    onChange={(e) => handleInputChange('telefono', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
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
                                disabled={isLoading || !formData.nombre.trim() || !formData.fechaNacimiento || !formData.genero || !formData.telefono.trim()}
                                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                        {isNewPatient ? 'Registrando...' : 'Guardando...'}
                                    </>
                                ) : (
                                    <>
                                        <Save size={16} className="mr-2" />
                                        {isNewPatient ? 'Registrar Paciente' : 'Guardar Cambios'}
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