import { useState, useEffect } from 'react';
import { getTareas, getProyectos, getComentarios, getUsuarios } from '../servicios/api';
import './Panel.css';

export default function Panel() {
  const [totalTasks, setTotalTasks] = useState(0);
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const tasks = await getTareas();
        const projects = await getProyectos();
        const comments = await getComentarios();
        const users = await getUsuarios();

        setTotalTasks(tasks.length);
        setTotalProjects(projects.length);
        setTotalComments(comments.length);
        setTotalUsers(users.length);
        setLoading(false);
      } catch (err) {
        setError('Hubo un error al cargar los datos.');
        console.error("Error al cargar datos:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando datos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <p className="error-message">{error}</p>
        <button className="retry-button" onClick={() => window.location.reload()}>Reintentar</button>
      </div>
    );
  }

  return (
    <div className="panel-container">
      <div className="panel-header">
        <h1>Panel de Inicio</h1>
        <p className="panel-subtitle">Resumen general de la aplicación</p>
      </div>

      <div className="stats-grid">
        <div className="stat-box task-box">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h2>Tareas Totales</h2>
            <p>{totalTasks}</p>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${Math.min(100, totalTasks * 10)}%` }}></div>
            </div>
          </div>
        </div>

        <div className="stat-box project-box">
          <div className="stat-icon">📂</div>
          <div className="stat-content">
            <h2>Proyectos Totales</h2>
            <p>{totalProjects}</p>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${Math.min(100, totalProjects * 20)}%` }}></div>
            </div>
          </div>
        </div>

        <div className="stat-box comment-box">
          <div className="stat-icon">💬</div>
          <div className="stat-content">
            <h2>Comentarios Totales</h2>
            <p>{totalComments}</p>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${Math.min(100, totalComments * 2)}%` }}></div>
            </div>
          </div>
        </div>

        <div className="stat-box user-box">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h2>Usuarios Activos</h2>
            <p>{totalUsers}</p>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${Math.min(100, totalUsers * 25)}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="chart-container">
        <h2 className="section-title">Distribución de Datos</h2>
        <div className="chart-wrapper">
          <div className="chart-bars-container">
            <div className="chart-bar-item">
              <div
                className="chart-bar"
                style={{ height: `${totalTasks * 2}px`, backgroundColor: '#4f46e5' }}
              ></div>
              <span className="chart-label">Tareas</span>
            </div>
            <div className="chart-bar-item">
              <div
                className="chart-bar"
                style={{ height: `${totalProjects * 4}px`, backgroundColor: '#10b981' }}
              ></div>
              <span className="chart-label">Proyectos</span>
            </div>
            <div className="chart-bar-item">
              <div
                className="chart-bar"
                style={{ height: `${totalComments * 0.2}px`, backgroundColor: '#f59e0b' }}
              ></div>
              <span className="chart-label">Comentarios</span>
            </div>
            <div className="chart-bar-item">
              <div
                className="chart-bar"
                style={{ height: `${totalUsers * 6}px`, backgroundColor: '#ef4444' }} 
              ></div>
              <span className="chart-label">Usuarios</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}