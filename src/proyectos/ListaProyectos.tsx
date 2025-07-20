import type { Proyecto } from '../interfaces/interfaces';
import styles from './Proyectos.module.css';
import { Trash2, Edit, CalendarCheck, CalendarPlus } from 'lucide-react'; // Importamos íconos de calendario

interface ListaProyectosProps {
  proyectos: Proyecto[];
  onDelete: (id: string) => void;
  onEdit: (proyecto: Proyecto) => void;
}

const ListaProyectos = ({ proyectos, onDelete, onEdit }: ListaProyectosProps) => {
  if (proyectos.length === 0) {
    return <p>Aún no has creado ningún proyecto. ¡Anímate a crear el primero!</p>;
  }

  return (
    <div className={styles.listaContainer}>
      {proyectos.map((proyecto) => (
        <div key={proyecto.id} className={styles.proyectoCard}>
          <div className={styles.cardHeader}>
            <h3>{proyecto.nombre}</h3>
            <span className={`${styles.estadoBadge} ${styles[proyecto.estado.replace(' ', '')]}`}>{proyecto.estado}</span>
          </div>
          <p>{proyecto.descripcion}</p>
          <div className={styles.cardFechas}>
            <span><CalendarPlus size={14}/> {proyecto.fecha_creacion}</span>
            {/* Mostramos la fecha de fin solo si existe */}
            {proyecto.fecha_fin_estimada && (
              <span><CalendarCheck size={14}/> {proyecto.fecha_fin_estimada}</span>
            )}
          </div>
          <div className={styles.cardFooter}>
            <div className={styles.acciones}>
              <button onClick={() => onEdit(proyecto)} className={styles.accionBtn}><Edit size={16} /></button>
              <button onClick={() => onDelete(proyecto.id)} className={`${styles.accionBtn} ${styles.btnEliminar}`}><Trash2 size={16} /></button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListaProyectos;