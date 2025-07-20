
import type { TareaConDetalles } from '../interfaces/interfaces';
import styles from './Tareas.module.css';
import { CheckCircle, Circle, Trash2, Edit, CalendarPlus, CalendarCheck } from 'lucide-react';

interface ListaTareasProps {
  tareas: TareaConDetalles[];
  onDelete: (id: string) => void;
  onEdit: (tarea: TareaConDetalles) => void;
  onToggleComplete: (tarea: TareaConDetalles) => void;
}

const ListaTareas = ({ tareas, onDelete, onEdit, onToggleComplete }: ListaTareasProps) => {
  if (tareas.length === 0) {
    return <p>¡Felicidades! No tienes tareas pendientes.</p>;
  }

  return (
    <div className={styles.listaContainer}>
      {tareas.map((tarea) => (
        <div key={tarea.id} className={`${styles.tareaCard} ${styles[tarea.prioridad]}`}>
          <div className={styles.tareaHeader}>
            <div className={styles.tareaTitulo}>
              <button 
                className={styles.btnCompletar} 
                onClick={() => onToggleComplete(tarea)}
              >
                {tarea.completada ? <CheckCircle size={20} className={styles.completadaIcon} /> : <Circle size={20} />}
              </button>
              <h3 className={tarea.completada ? styles.tituloCompletado : ''}>{tarea.titulo}</h3>
            </div>
            <div className={styles.prioridadBadge}>{tarea.prioridad}</div>
          </div>
          <p className={styles.tareaDescripcion}>{tarea.descripcion}</p>
          <div className={styles.tareaFooter}>
            <div className={styles.tareaFechas}>
              <span><CalendarPlus size={14} /> {tarea.fecha_creacion}</span>
              {tarea.fecha_vencimiento && (
                <span className={styles.fechaVencimiento}><CalendarCheck size={14} /> {tarea.fecha_vencimiento}</span>
              )}
            </div>
            <div className={styles.tags}>
              {tarea.proyecto && <span className={styles.tagProyecto}>{tarea.proyecto?.nombre}</span>}
              {tarea.categoria && <span className={styles.tagCategoria}>{tarea.categoria?.nombre}</span>}
            </div>
            <div className={styles.acciones}>
              <button onClick={() => onEdit(tarea)} className={styles.accionBtn}><Edit size={16} /></button>
              <button onClick={() => onDelete(tarea.id)} className={`${styles.accionBtn} ${styles.btnEliminar}`}><Trash2 size={16} /></button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListaTareas;