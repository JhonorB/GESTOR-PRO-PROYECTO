import React, { useState } from 'react';
import type { Tarea } from '../interfaces/interfaces';
import styles from './Tareas.module.css';

interface EditModalProps {
  tarea: Tarea;
  onClose: () => void;
  onUpdate: (tarea: Tarea) => void;
}

const EditTaskModal = ({ tarea, onClose, onUpdate }: EditModalProps) => {
  const [titulo, setTitulo] = useState(tarea.titulo);
  const [descripcion, setDescripcion] = useState(tarea.descripcion);
  const [prioridad, setPrioridad] = useState(tarea.prioridad);
  const [fechaVencimiento, setFechaVencimiento] = useState(tarea.fecha_vencimiento ? tarea.fecha_vencimiento.substring(0, 10) : ''); // Formato YYYY-MM-DD para input date

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const tareaActualizada: Tarea = {
      ...tarea,
      titulo: titulo,
      descripcion: descripcion,
      prioridad: prioridad,
      fecha_vencimiento: fechaVencimiento,
    };
    onUpdate(tareaActualizada);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Editar Tarea</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="titulo">Título</label>
            <input
              id="titulo"
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className={styles.formInput}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className={styles.formTextarea}
              rows={4} 
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="prioridad">Prioridad</label>
            <select
              id="prioridad"
              value={prioridad}
              onChange={(e) => setPrioridad(e.target.value as 'Alta' | 'Media' | 'Baja')}
              className={styles.formSelect}
              required
            >
              <option value="Alta">Alta</option>
              <option value="Media">Media</option>
              <option value="Baja">Baja</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="fechaVencimiento">Fecha de Vencimiento</label>
            <input
              id="fechaVencimiento"
              type="date"
              value={fechaVencimiento}
              onChange={(e) => setFechaVencimiento(e.target.value)}
              className={styles.formInput}
            />
          </div>



          <div className={styles.modalActions}>
            <button type="button" onClick={onClose} className={styles.btnSecondary}>Cancelar</button>
            <button type="submit" className={styles.btnPrimary}>Guardar Cambios</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;