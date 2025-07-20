import  { useState, useEffect } from 'react';
import ListaTareas from './ListaTareas';
import FormTareas from './FormTareas';
import EditTaskModal from './EditTaskModal';
import { getTareasDeUsuarioConDetalles, crearTarea, actualizarTarea, eliminarTarea } from '../servicios/api'; 
import type { Tarea, TareaConDetalles } from '../interfaces/interfaces';

const TasksPage = () => {
  const [tareas, setTareas] = useState<TareaConDetalles[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tareaSeleccionada, setTareaSeleccionada] = useState<TareaConDetalles | null>(null);

  useEffect(() => {
    const cargarTareasIniciales = async () => {
      const usuarioData = localStorage.getItem('usuario');
      if (!usuarioData) {
        setError('No se pudo identificar al usuario.');
        setLoading(false);
        return;
      }
      const usuarioLogueado = JSON.parse(usuarioData);
      try {
        setLoading(true);
        const data = await getTareasDeUsuarioConDetalles(usuarioLogueado.id);
        setTareas(data);
      } catch  {
        setError('No se pudieron cargar las tareas.');
      } finally {
        setLoading(false);
      }
    };
    cargarTareasIniciales();
  }, []);

  const handleTaskCreated = async (nuevaTareaSinId: Omit<Tarea, 'id' | 'completada'>) => {
    try {
      const nuevoId = `T${tareas.length + 1}`;
      const nuevaTareaCompleta: Tarea = { ...nuevaTareaSinId, id: nuevoId, completada: false };
      await crearTarea(nuevaTareaCompleta);
      const tareaParaLista: TareaConDetalles = { ...nuevaTareaCompleta };
      setTareas(prevTareas => [tareaParaLista, ...prevTareas]);
    } catch {
      alert('Error al crear la tarea.');
    }
  };

  const handleTaskDeleted = async (idTarea: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      try {
        await eliminarTarea(idTarea);
        setTareas(prevTareas => prevTareas.filter(t => t.id !== idTarea));
      } catch {
        alert('Error al eliminar la tarea.');
      }
    }
  };
  
  const handleToggleComplete = async (tarea: TareaConDetalles) => {
    const nuevoEstado = !tarea.completada;
    setTareas(prevTareas => 
      prevTareas.map(t => 
        t.id === tarea.id ? { ...t, completada: nuevoEstado } : t
      )
    );
    try {
      await actualizarTarea(tarea.id, { completada: nuevoEstado });
    } catch {
      alert('Error al actualizar la tarea.');
      setTareas(prevTareas => 
        prevTareas.map(t => 
          t.id === tarea.id ? { ...t, completada: !nuevoEstado } : t
        )
      );
    }
  };

  const handleTaskUpdated = async (tareaActualizada: Tarea) => {
    try {
      await actualizarTarea(tareaActualizada.id, tareaActualizada);
      setTareas(prevTareas => prevTareas.map(t => (t.id === tareaActualizada.id ? { ...t, ...tareaActualizada } : t)));
      closeModal();
    } catch {
      alert('Error al actualizar la tarea.');
    }
  };

  const openModal = (tarea: TareaConDetalles) => {
    setTareaSeleccionada(tarea);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTareaSeleccionada(null);
  };

  return (
    <div>
      <h1 style={{ marginBottom: '1rem' }}>Mi Lista de Tareas</h1>
      <FormTareas onTaskCreated={handleTaskCreated} />
      <hr style={{ margin: '2rem 0' }} />
      {loading && <p>Cargando tareas...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && (
        <ListaTareas 
          tareas={tareas} 
          onDelete={handleTaskDeleted} 
          onEdit={openModal}
          onToggleComplete={handleToggleComplete}
        />
      )}
      {isModalOpen && tareaSeleccionada && (
        <EditTaskModal 
          tarea={tareaSeleccionada} 
          onClose={closeModal} 
          onUpdate={handleTaskUpdated} 
        />
      )}
    </div>
  );
};

export default TasksPage;