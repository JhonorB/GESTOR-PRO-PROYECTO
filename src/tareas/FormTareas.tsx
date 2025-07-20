import React, { useState, useEffect } from 'react';
import type { Tarea, Categoria, Proyecto } from '../interfaces/interfaces';
import { getCategorias, getProyectosDeUsuario } from '../servicios/api';
import styles from './Tareas.module.css';

interface FormTareasProps {
  onTaskCreated: (nuevaTareaSinId: Omit<Tarea, 'id' | 'completada'>) => void;
}

const FormTareas = ({ onTaskCreated }: FormTareasProps) => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [prioridad, setPrioridad] = useState<'Alta' | 'Media' | 'Baja'>('Media');
  const [fechaVencimiento, setFechaVencimiento] = useState('');
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [categoriaId, setCategoriaId] = useState('');
  const [proyectoId, setProyectoId] = useState('');

  useEffect(() => {
    const cargarDatosDesplegables = async () => {
      try {
        const usuarioData = localStorage.getItem('usuario');
        if (!usuarioData) return;
        const usuarioLogueado = JSON.parse(usuarioData);

        const cats = await getCategorias();
        setCategorias(cats);
        if (cats.length > 0) setCategoriaId(cats[0].id);
        
        const proys = await getProyectosDeUsuario(usuarioLogueado.id);
        setProyectos(proys);
      } catch (error) {
        console.error("Error al cargar datos para el formulario", error);
      }
    };
    cargarDatosDesplegables();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!titulo) return;
    const usuarioData = localStorage.getItem('usuario');
    if (!usuarioData) return;
    const usuarioLogueado = JSON.parse(usuarioData);

    const nuevaTareaSinId = {
      titulo,
      descripcion,
      prioridad,
      categoria_id: categoriaId,
      proyecto_id: proyectoId || null,
      usuario_id: usuarioLogueado.id,
      fecha_creacion: new Date().toISOString().split('T')[0],
      fecha_vencimiento: fechaVencimiento,
    };
    onTaskCreated(nuevaTareaSinId);
    setTitulo('');
    setDescripcion('');
    setFechaVencimiento('');
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <h3>Añadir Nueva Tarea</h3>
      <input
        type="text"
        placeholder="Título de la tarea"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        className={styles.formInput}
        required
      />
      <textarea
        placeholder="Descripción (opcional)"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        className={styles.formTextarea}
      />
      <div className={styles.formRow}>
        <select value={prioridad} onChange={(e) => setPrioridad(e.target.value as 'Alta' | 'Media' | 'Baja')} className={styles.formSelect}>
          <option value="Baja">Prioridad Baja</option>
          <option value="Media">Prioridad Media</option>
          <option value="Alta">Prioridad Alta</option>
        </select>
        <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} className={styles.formSelect} required>
          {categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.nombre}</option>)}
        </select>
        <select value={proyectoId} onChange={(e) => setProyectoId(e.target.value)} className={styles.formSelect}>
          <option value="">Sin Proyecto</option>
          {proyectos.map(proy => <option key={proy.id} value={proy.id}>{proy.nombre}</option>)}
        </select>
        <input
          type="date"
          value={fechaVencimiento}
          onChange={(e) => setFechaVencimiento(e.target.value)}
          className={styles.formInput}
        />
      </div>
      <button type="submit" className={styles.formButton}>Añadir Tarea</button>
    </form>
  );
};

export default FormTareas;