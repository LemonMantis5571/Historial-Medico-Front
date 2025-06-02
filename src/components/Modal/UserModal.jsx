import React, { useState, useEffect } from 'react';
import { Edit, Save, X } from 'lucide-react';

export default function UserModal({ user, onUpdate }) {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        name:'',
        fecha_nacimiento: '',
        gender: '',
        phone: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        if (user && isOpen) {
            setFormData({
                name: user.name || '',
                fecha_nacimiento: user.fecha_nacimiento || '',
                gender: user.gender || '',
                phone: user.phone || '',
            });
        }
    }, [user, isOpen]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };
    

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://127.0.0.1:5002/pacientes/${user.patientId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre: formData.name || user.name,
                    telefono: formData.phone,
                    genero: formData.gender,
                    fecha_nacimiento: formData.fecha_nacimiento,
                }),
            });

            if (!response.ok) {
                throw new Error('Error updating user');
            }
            
            onUpdate();


            setIsOpen(false);
        } catch (error) {
            console.error('Error updating user:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (user) {
            setFormData({
                name: user.name || '',
                fecha_nacimiento: user.fecha_nacimiento || '',
                gender: user.gender || '',
                phone: user.phone || '',
            });
        }
        setIsOpen(false);
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    return (
        <>
            <button 
                onClick={() => setIsOpen(true)} 
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
                <Edit size={16} className="mr-2" />
                Editar
            </button>
        
            {isOpen && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center p-4  bg-opacity-50 backdrop-blur-sm"
                    onClick={handleBackdropClick}
                >
                    <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl transform transition-all duration-200 scale-100">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Edita tu información
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Actualiza la información del paciente
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
                        <div className="p-6 space-y-4">
                         <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre del Paciente *
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ej: Juan Pérez"
                                    value={user.name || ''}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                                    required
                                    disabled={true} 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Fecha de Nacimiento *
                                </label>
                                <input
                                    type="date"
                                    placeholder="Ej: 21"
                                    value={formData.fecha_nacimiento}
                                    onChange={(e) => handleInputChange('fecha_nacimiento', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Gender Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Género *
                                </label>
                                <select
                                    value={formData.gender}
                                    onChange={(e) => handleInputChange('gender', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                                    required
                                    disabled={isLoading}
                                >
                                    <option value="">Seleccionar género</option>
                                    <option value="Masculino">Masculino</option>
                                    <option value="Femenino">Femenino</option>
                                    <option value="Otro">Otro</option>
                                    <option value="Prefiero no decir">Prefiero no decir</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Contacto *
                                </label>
                                <input
                                    type="tel"
                                    placeholder="Ej: 1234-5678"
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
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
                                disabled={isLoading || !formData.fecha_nacimiento || !formData.gender.trim() || !formData.phone.trim()}
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