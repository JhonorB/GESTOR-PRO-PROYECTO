import { useState, useEffect } from 'react';
import FormProyectos from './FormProyectos';
import ListaProyectos from './ListaProyectos';
import { getProyectosDeUsuario, crearProyecto, actualizarProyecto, eliminarProyecto } from '../servicios/api';
import type { Proyecto } from '../interfaces/interfaces';
import EditProjectModal from './Editproyecto';
import styles from './Proyectos.module.css';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';

// --- Importaciones para PDF ---
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // El plugin añade métodos a jsPDF (requiere src/types/jspdf.d.ts)

// --- Importaciones para XLSX ---
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const ProyectoPage = () => { // <--- Nombre del componente: ProyectoPage
    const [proyectos, setProyectos] = useState<Proyecto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [proyectoSeleccionado, setProyectoSeleccionado] = useState<Proyecto | null>(null);

    useEffect(() => {
        const cargarProyectos = async () => {
            const usuarioData = localStorage.getItem('usuario');
            if (!usuarioData) {
                setError('No se pudo identificar al usuario.');
                setLoading(false);
                return;
            }
            const usuarioLogueado = JSON.parse(usuarioData);
            try {
                setLoading(true);
                const data = await getProyectosDeUsuario(usuarioLogueado.id);
                setProyectos(data);
            } catch (err) {
                setError('No se pudieron cargar los proyectos.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        cargarProyectos();
    }, []);

    const handleProjectCreated = async (proyectoSinId: Omit<Proyecto, 'id'>) => {
        try {
            // El ID será generado automáticamente por json-server al hacer POST
            const proyectoCreado = await crearProyecto(proyectoSinId);
            setProyectos(prev => [proyectoCreado, ...prev]);
        } catch (error) {
            alert('Error al crear el proyecto.');
            console.error(error);
        }
    };

    const handleProjectDeleted = async (idProyecto: string) => {
        if (window.confirm('¿Estás seguro? Esto eliminará el proyecto y todas sus tareas asociadas.')) {
            try {
                await eliminarProyecto(idProyecto);
                setProyectos(prev => prev.filter(p => p.id !== idProyecto));
            } catch (error) {
                alert('Error al eliminar el proyecto.');
                console.error(error);
            }
        }
    };

    const handleProjectUpdated = async (proyectoActualizado: Proyecto) => {
        try {
            await actualizarProyecto(proyectoActualizado.id, proyectoActualizado);
            setProyectos(prev => prev.map(p => (p.id === proyectoActualizado.id ? proyectoActualizado : p)));
            closeModal();
        } catch (error) {
            alert('Error al actualizar el proyecto.');
            console.error(error);
        }
    };

    const openModal = (proyecto: Proyecto) => {
        setProyectoSeleccionado(proyecto);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setProyectoSeleccionado(null);
    };

    // --- FUNCIÓN PARA EXPORTAR A CSV ---
    const handleExportCsv = () => {
        if (proyectos.length === 0) {
            alert("No hay proyectos para exportar.");
            return;
        }
        const headers = ["ID", "Nombre", "Descripcion", "ID_Usuario", "Estado", "Fecha_Creacion", "Fecha_Fin_Estimada"];
        const csvRows = [];
        csvRows.push(headers.join(','));
        for (const proyecto of proyectos) {
            const row = [
                `"${proyecto.id}"`,
                `"${proyecto.nombre.replace(/"/g, '""')}"`,
                `"${proyecto.descripcion.replace(/"/g, '""')}"`,
                `"${proyecto.usuario_id}"`,
                `"${proyecto.estado}"`,
                `"${proyecto.fecha_creacion.substring(0, 10)}"`,
                `"${proyecto.fecha_fin_estimada ? proyecto.fecha_fin_estimada.substring(0, 10) : ''}"`
            ];
            csvRows.push(row.join(','));
        }
        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, 'proyectos_gestorpro.csv');
    };

    // --- FUNCIÓN PARA EXPORTAR A PDF ---
    const handleExportPdf = () => {
        if (proyectos.length === 0) {
            alert("No hay proyectos para exportar.");
            return;
        }

        const doc = new jsPDF();

        const tableColumn: string[] = ["ID", "Nombre", "Descripción", "Estado", "Fecha Creación", "Fecha Fin Estimada"];
        const tableRows: string[][] = [];

        proyectos.forEach(proyecto => {
            const proyectoData: string[] = [
                proyecto.id,
                proyecto.nombre,
                proyecto.descripcion.substring(0, 50) + (proyecto.descripcion.length > 50 ? '...' : ''),
                proyecto.estado,
                proyecto.fecha_creacion.substring(0, 10),
                proyecto.fecha_fin_estimada ? proyecto.fecha_fin_estimada.substring(0, 10) : 'N/A'
            ];
            tableRows.push(proyectoData);
        });

        doc.text("Reporte de Proyectos", 14, 15);

        // autoTable es reconocido gracias a src/types/jspdf.d.ts
        doc.autoTable({ 
            head: [tableColumn],
            body: tableRows,
            startY: 20,
            theme: 'striped',
            headStyles: { fillColor: [60, 141, 188] },
            styles: {
                font: 'helvetica',
                fontSize: 8,
                cellPadding: 3,
                valign: 'middle',
                overflow: 'linebreak',
                lineWidth: 0.1,
                lineColor: [200, 200, 200]
            },
            columnStyles: {
                0: { cellWidth: 15 },
                1: { cellWidth: 40 },
                2: { cellWidth: 80 },
                3: { cellWidth: 25 },
                4: { cellWidth: 25 },
                5: { cellWidth: 25 }
            }
        });

        doc.save('proyectos_gestorpro.pdf');
    };

    // --- FUNCIÓN PARA EXPORTAR A XLSX (Excel) ---
    const handleExportXlsx = () => {
        if (proyectos.length === 0) {
            alert("No hay proyectos para exportar.");
            return;
        }

        const data: string[][] = proyectos.map(proyecto => ([
            proyecto.id,
            proyecto.nombre,
            proyecto.descripcion,
            proyecto.usuario_id,
            proyecto.estado,
            proyecto.fecha_creacion.substring(0, 10),
            proyecto.fecha_fin_estimada ? proyecto.fecha_fin_estimada.substring(0, 10) : ''
        ]));

        const headers: string[] = ["ID", "Nombre", "Descripcion", "ID_Usuario", "Estado", "Fecha_Creacion", "Fecha_Fin_Estimada"];
        const wsData: string[][] = [headers, ...data];

        const ws = XLSX.utils.aoa_to_sheet(wsData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Proyectos");

        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([wbout], { type: 'application/octet-stream' });
        saveAs(blob, 'proyectos_gestorpro.xlsx');
    };

    return (
        <div className={styles.proyectosPageContainer}>
            <h1 className={styles.pageTitle}>Mis Proyectos</h1>
            
            {/* --- SECCIÓN DE BOTONES DE EXPORTACIÓN --- */}
            <div className={styles.exportSection}>
                <button 
                    onClick={handleExportCsv} 
                    className={`${styles.exportButton} ${styles.exportButtonCsv}`}
                    disabled={proyectos.length === 0 && !loading}
                    title="Exportar a CSV"
                >
                    <Download size={18} /> CSV
                </button>
                <button 
                    onClick={handleExportPdf} 
                    className={`${styles.exportButton} ${styles.exportButtonPdf}`}
                    disabled={proyectos.length === 0 && !loading}
                    title="Exportar a PDF"
                >
                    <FileText size={18} /> PDF
                </button>
                <button 
                    onClick={handleExportXlsx} 
                    className={`${styles.exportButton} ${styles.exportButtonXlsx}`}
                    disabled={proyectos.length === 0 && !loading}
                    title="Exportar a XLSX"
                >
                    <FileSpreadsheet size={18} /> Excel
                </button>
            </div>

            <FormProyectos onProjectCreated={handleProjectCreated} />
            <hr className={styles.divider} />
            {loading && <p className={styles.loadingMessage}>Cargando proyectos...</p>}
            {error && <p className={styles.errorMessage}>{error}</p>}
            {!loading && !error && (
                <ListaProyectos proyectos={proyectos} onDelete={handleProjectDeleted} onEdit={openModal} />
            )}
            {isModalOpen && proyectoSeleccionado && (
                <EditProjectModal proyecto={proyectoSeleccionado} onClose={closeModal} onUpdate={handleProjectUpdated} />
            )}
        </div>
    );
};

export default ProyectoPage;