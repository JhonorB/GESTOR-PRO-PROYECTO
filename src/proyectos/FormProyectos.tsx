import React, { useState } from 'react';
import type { Proyecto } from '../interfaces/interfaces';
import styles from './Proyectos.module.css';

interface FormProyectosProps {
    onProjectCreated: (proyectoSinId: Omit<Proyecto, 'id'>) => void;
}

const FormProyectos = ({ onProjectCreated }: FormProyectosProps) => {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    // 1. Añadimos los estados para los nuevos campos
    const [estado, setEstado] = useState<'Planificado' | 'En Progreso' | 'En Pausa' | 'Completado'>('Planificado');
    const [fechaFinEstimada, setFechaFinEstimada] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!nombre) return;
        const usuarioData = localStorage.getItem('usuario');
        if (!usuarioData) return;
        const usuarioLogueado = JSON.parse(usuarioData);

        // 2. Usamos los nuevos estados al crear el objeto
        const nuevoProyectoSinId = {
            nombre,
            descripcion,
            usuario_id: usuarioLogueado.id,
            estado: estado,
            fecha_creacion: new Date().toISOString().split('T')[0],
            fecha_fin_estimada: fechaFinEstimada,
        };
        onProjectCreated(nuevoProyectoSinId);
        
        // 3. Limpiamos todos los campos del formulario
        setNombre('');
        setDescripcion('');
        setEstado('Planificado');
        setFechaFinEstimada('');
    };

    return (
        <form onSubmit={handleSubmit} className={styles.formContainer}>
            <h3>Crear Nuevo Proyecto</h3>
            <input
                type="text"
                placeholder="Nombre del proyecto"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className={styles.formInput}
                required
            />
            <textarea
                placeholder="Descripción (opcional)"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className={styles.formTextarea}
            />

            {/* 4. Añadimos la fila con los nuevos campos */}
            <div className={styles.formRow}>
                <select 
                    value={estado} 
                    onChange={(e) => setEstado(e.target.value as Proyecto['estado'])} 
                    className={styles.formSelect}
                >
                    <option value="Planificado">Planificado</option>
                    <option value="En Progreso">En Progreso</option>
                    <option value="En Pausa">En Pausa</option>
                    <option value="Completado">Completado</option>
                </select>
                <input
                    type="date"
                    value={fechaFinEstimada}
                    onChange={(e) => setFechaFinEstimada(e.target.value)}
                    className={styles.formInput}
                />
            </div>

            <button type="submit" className={styles.formButton}>Crear Proyecto</button>
        </form>
    );
};

export default FormProyectos;