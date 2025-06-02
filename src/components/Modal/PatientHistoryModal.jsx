import React, { useState } from 'react';
import { X, Calendar, FileText, User, AlertCircle } from 'lucide-react';

export default function PatientHistoryModal({ patient, patientId, onClose }) {
    const [historyData, setHistoryData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const fetchPatientHistory = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://127.0.0.1:5002/historial/paciente/${patientId}`);
            
            if (response.status === 404) {
                setHistoryData([]);
                return;
            }
            
            if (!response.ok) {
                throw new Error('Error al cargar el historial');
            }


            
            const data = await response.json();
            console.log('Historial médico:', data);
            setHistoryData(data);
        } catch (error) {
            console.error('Error fetching patient history:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = () => {
        setIsOpen(true);
        if (patient?.patientId) {
            fetchPatientHistory();
        }
    };

    const handleCloseModal = () => {
        setIsOpen(false);
        setHistoryData([]);
        setError(null);
        if (onClose) {
            onClose();
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
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <>
            {/* Trigger Button */}
            <button 
                onClick={handleOpenModal}
                className="text-blue-600 hover:text-blue-900 text-sm font-medium transition-colors duration-200"
            >
                Ver Historial
            </button>

            {/* Modal */}
            {isOpen && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center p-4  bg-opacity-50 backdrop-blur-sm"
                    onClick={handleBackdropClick}
                >
                    <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-xl shadow-2xl transform transition-all duration-200 scale-100 overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                                    <User size={24} className="text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        Historial Médico
                                    </h2>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {patient?.name || 'Paciente'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleCloseModal}
                                className="p-2 hover:bg-white hover:bg-opacity-50 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                            >
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto max-h-[calc(90vh-120px)]">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
                                    <span className="ml-3 text-gray-600">Cargando historial...</span>
                                </div>
                            ) : error ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="text-center">
                                        <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
                                        <p className="text-red-600 font-medium mb-2">Error al cargar el historial</p>
                                        <p className="text-gray-500 text-sm">{error}</p>
                                        <button 
                                            onClick={() => fetchPatientHistory()}
                                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                        >
                                            Reintentar
                                        </button>
                                    </div>
                                </div>
                            ) : historyData.length === 0 ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="text-center">
                                        <FileText size={48} className="text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600 font-medium mb-2">Sin historial médico</p>
                                        <p className="text-gray-500 text-sm">Este paciente no tiene registros médicos disponibles.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-6 space-y-6">
                                    {historyData.map((historial) => (
                                        <div key={historial.ID_Historial} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                            {/* History Header */}
                                            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-300">
                                                <div className="flex items-center">
                                                    <Calendar size={20} className="text-blue-600 mr-3" />
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900">
                                                            Registro Médico #{historial.ID_Historial}
                                                        </h3>
                                                        <p className="text-sm text-gray-600">
                                                            Creado el {formatDate(historial.Fecha_Creación)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Diagnoses */}
                                            <div>
                                                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                                                    <FileText size={16} className="text-green-600 mr-2" />
                                                    Diagnósticos ({historial.diagnosticos.length})
                                                </h4>
                                                
                                                {historial.diagnosticos.length === 0 ? (
                                                    <p className="text-gray-500 text-sm italic ml-6">
                                                        No hay diagnósticos registrados para este historial.
                                                    </p>
                                                ) : (
                                                    <div className="space-y-3 ml-6">
                                                        {historial.diagnosticos.map((diagnostico) => (
                                                            <div key={diagnostico.ID_Diagnóstico} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                                                                <div className="flex items-start justify-between">
                                                                    <div className="flex-1">
                                                                        <p className="text-gray-900 font-medium mb-1">
                                                                            {diagnostico.Descripción}
                                                                        </p>
                                                                        <p className="text-sm text-gray-600">
                                                                            Fecha: {formatDate(diagnostico.Fecha)}
                                                                        </p>
                                                                        {diagnostico.ID_Cita && (
                                                                            <p className="text-xs text-blue-600 mt-1">
                                                                                Cita #{diagnostico.ID_Cita}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                                                                        #{diagnostico.ID_Diagnóstico}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50">
                            <button
                                onClick={handleCloseModal}
                                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}