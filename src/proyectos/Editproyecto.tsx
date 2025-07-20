import React, { useState } from 'react';
import type { Proyecto } from '../interfaces/interfaces';
import styles from './Proyectos.module.css';

interface EditModalProps {
  proyecto: Proyecto;
  onClose: () => void;
  onUpdate: (proyecto: Proyecto) => void;
}

const EditProjectModal = ({ proyecto, onClose, onUpdate }: EditModalProps) => {
  // 1. Añadimos estados para los nuevos campos
  const [nombre, setNombre] = useState(proyecto.nombre);
  const [descripcion, setDescripcion] = useState(proyecto.descripcion);
  const [estado, setEstado] = useState(proyecto.estado);
  const [fechaFin, setFechaFin] = useState(proyecto.fecha_fin_estimada);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 2. Incluimos los nuevos campos en el objeto actualizado
    onUpdate({ ...proyecto, nombre, descripcion, estado, fecha_fin_estimada: fechaFin });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Editar Proyecto</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Nombre del Proyecto</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className={styles.formInput}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className={styles.formTextarea}
            />
          </div>

          {/* 3. Añadimos los nuevos campos al formulario */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Estado</label>
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
            </div>
            <div className={styles.formGroup}>
              <label>Fecha de Fin Estimada</label>
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className={styles.formInput}
              />
            </div>
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

export default EditProjectModal;