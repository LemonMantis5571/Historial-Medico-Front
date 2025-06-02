import React, { useState, useEffect } from 'react';
import { Edit, Save, X, Plus } from 'lucide-react';

export default function ProfessionalModal({ professional, onUpdate }) {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        specialty: '',
        phone: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    // Common medical specialties
    const specialties = [
        'Medicina General',
        'Cardiología',
        'Dermatología',
        'Endocrinología',
        'Gastroenterología',
        'Ginecología',
        'Neurología',
        'Oftalmología',
        'Ortopedia',
        'Pediatría',
        'Psiquiatría',
        'Radiología',
        'Urología',
        'Otro'
    ];

    useEffect(() => {
        if (professional && isOpen) {
            setFormData({
                name: professional.name || '',
                specialty: professional.specialty || '',
                phone: professional.phone || ''
            });
        }
    }, [professional, isOpen]);

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://127.0.0.1:5002/medicos/${professional.ID_Doctor}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    specialty: formData.specialty,
                    phone: formData.phone
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error updating professional info');
            }

            const data = await response.json();
            
            onUpdate();
            
            setIsOpen(false);
        } catch (error) {
            console.error('Error updating professional info:', error);
            alert('Error al actualizar la información: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (professional) {
            setFormData({
                name: professional.name || '',
                specialty: professional.specialty || '',
                phone: professional.phone || ''
            });
        }
        setIsOpen(false);
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    const isFormValid = formData.name.trim() && formData.specialty.trim() && 
                      formData.phone.trim();

    return (
        <>
            {/* Trigger Button */}
            <button 
                onClick={() => setIsOpen(true)} 
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
                <Edit size={16} className="mr-2" />
                Editar
            </button>
            
            {/* Modal */}
            {isOpen && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center p-4  bg-opacity-50 backdrop-blur-sm"
                    onClick={handleBackdropClick}
                >
                    <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl transform transition-all duration-200 scale-100">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Editar Información Profesional
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Actualiza los datos profesionales
                                </p>
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
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre *
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ej: Dr. Juan Pérez"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Specialty */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Especialidad *
                                </label>
                                <select
                                    value={formData.specialty}
                                    onChange={(e) => setFormData(prev => ({ ...prev, specialty: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                                    required
                                    disabled={isLoading}
                                >
                                    <option value="">Seleccionar especialidad</option>
                                    {specialties.map((specialty) => (
                                        <option key={specialty} value={specialty}>
                                            {specialty}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Teléfono *
                                </label>
                                <input
                                    type="tel"
                                    placeholder="Ej: 1234-5678"
                                    value={formData.phone}
                                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                                    required
                                    disabled={isLoading}
                                />
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
                                disabled={isLoading || !isFormValid}
                                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <Save size={16} className="mr-2" />
                                        Guardar Cambios
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