// src/notificaciones/NotificationsPage.tsx
import { useState, useEffect } from 'react';
import type { Notificacion, Tarea, AnuncioActualizacion } from '../interfaces/interfaces';
import { getTareas, getAnunciosActualizacion } from '../servicios/api';
import styles from './NotificationsPage.module.css';
import { Bell, AlertCircle, Clock, CheckCircle, X, Check } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const NOTIFICACION_SISTEMA_UNICA_ID_LEGACY = "sys-update-20250719";

const NotificationsPage = () => {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    const fetchAndProcessNotifications = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const storedNotifications = localStorage.getItem('userNotifications');
        let currentNotifications: Notificacion[] = storedNotifications ? JSON.parse(storedNotifications) : [];

        currentNotifications = currentNotifications.filter(n => n.id !== NOTIFICACION_SISTEMA_UNICA_ID_LEGACY);

        let fetchedTareas: Tarea[] = [];
        let fetchedAnuncios: AnuncioActualizacion[] = [];

        try {
          fetchedTareas = await getTareas();
          fetchedAnuncios = await getAnunciosActualizacion();
        } catch (apiError) {
          console.error("Error al obtener datos para notificaciones:", apiError);
        }

        // Procesamiento de notificaciones (igual que antes)
        const nuevasNotifAnuncios: Notificacion[] = fetchedAnuncios
          .map(anuncio => ({
            id: `anuncio-${anuncio.id}`,
            tipo: 'sistema' as const,
            mensaje: `Actualización: ${anuncio.titulo}. ${anuncio.contenido.substring(0, 50)}...`,
            fecha_creacion: anuncio.fecha_publicacion,
            leida: false,
            enlace: anuncio.enlace_mas_info || '',
            referenciaId: anuncio.id
          }))
          .filter(newNotif => !currentNotifications.some(existingNotif => existingNotif.id === newNotif.id));

        const nuevasTareasAltaPrioridad: Notificacion[] = fetchedTareas
          .filter(tarea => tarea.prioridad === 'Alta' && !tarea.completada)
          .map(tarea => ({
            id: `tarea-alta-${tarea.id}`,
            tipo: 'tarea_alta_prioridad' as const,
            mensaje: `Tarea de Alta Prioridad: "${tarea.titulo}" necesita tu atención.`,
            fecha_creacion: new Date(tarea.fecha_creacion).toISOString(),
            leida: false,
            enlace: `/tareas?id=${tarea.id}`,
            referenciaId: tarea.id
          }))
          .filter(newNotif => !currentNotifications.some(existingNotif => existingNotif.id === newNotif.id));

        currentNotifications = [...nuevasNotifAnuncios, ...nuevasTareasAltaPrioridad, ...currentNotifications];

        // Filtrado y ordenamiento (igual que antes)
        currentNotifications = currentNotifications.filter(notif => {
          if (notif.tipo === 'tarea_alta_prioridad' && notif.referenciaId) {
            const tareaReferenciada = fetchedTareas.find(t => t.id === notif.referenciaId);
            return tareaReferenciada ? !tareaReferenciada.completada : false;
          }
          if (notif.tipo === 'sistema' && notif.referenciaId && notif.referenciaId.startsWith('ACT')) {
            const anuncioReferenciado = fetchedAnuncios.find(a => a.id === notif.referenciaId);
            return !!anuncioReferenciado;
          }
          return true;
        });

        currentNotifications.sort((a, b) => new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime());

        setNotificaciones(currentNotifications);
        localStorage.setItem('userNotifications', JSON.stringify(currentNotifications));
        window.dispatchEvent(new Event('notificationsUpdated'));

      } catch (err) {
        console.error("Error al cargar notificaciones:", err);
        setError("Error al cargar las notificaciones. Inténtalo de nuevo.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndProcessNotifications();
    const refreshInterval = setInterval(fetchAndProcessNotifications, 300000);
    return () => clearInterval(refreshInterval);
  }, []);

  const marcarComoLeida = (id: string) => {
    setNotificaciones(prevNotifs => {
      const updatedNotifs = prevNotifs.map(notif =>
        notif.id === id ? { ...notif, leida: true } : notif
      );
      localStorage.setItem('userNotifications', JSON.stringify(updatedNotifs));
      window.dispatchEvent(new Event('notificationsUpdated'));
      return updatedNotifs;
    });
  };

  const borrarNotificacion = (id: string) => {
    setNotificaciones(prevNotifs => {
      const updatedNotifs = prevNotifs.filter(notif => notif.id !== id);
      localStorage.setItem('userNotifications', JSON.stringify(updatedNotifs));
      window.dispatchEvent(new Event('notificationsUpdated'));
      return updatedNotifs;
    });
  };

  const marcarTodasComoLeidas = () => {
    setNotificaciones(prevNotifs => {
      const updatedNotifs = prevNotifs.map(notif => ({ ...notif, leida: true }));
      localStorage.setItem('userNotifications', JSON.stringify(updatedNotifs));
      window.dispatchEvent(new Event('notificationsUpdated'));
      return updatedNotifs;
    });
  };

  const filteredNotifications = notificaciones.filter(notif => 
    activeFilter === 'all' || !notif.leida
  );

  const getIcon = (tipo: Notificacion['tipo']) => {
    switch (tipo) {
      case 'sistema': return <CheckCircle size={20} />;
      case 'tarea_alta_prioridad': return <AlertCircle size={20} />;
      case 'recordatorio': return <Clock size={20} />;
      default: return <Bell size={20} />;
    }
  };

  const getBadgeColor = (tipo: Notificacion['tipo']) => {
    switch (tipo) {
      case 'sistema': return '#10b981';
      case 'tarea_alta_prioridad': return '#ef4444';
      case 'recordatorio': return '#f59e0b';
      default: return '#3b82f6';
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Cargando notificaciones...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>⚠️</div>
        <p className={styles.errorMessage}>{error}</p>
        <button 
          className={styles.retryButton}
          onClick={() => window.location.reload()}
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className={styles.notificationsPage}>
      <div className={styles.header}>
        <h1>
          <Bell size={28} className={styles.headerIcon} />
          Notificaciones
        </h1>
        
        <div className={styles.controls}>
          <div className={styles.filterButtons}>
            <button
              className={`${styles.filterButton} ${activeFilter === 'all' ? styles.active : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              Todas
            </button>
            <button
              className={`${styles.filterButton} ${activeFilter === 'unread' ? styles.active : ''}`}
              onClick={() => setActiveFilter('unread')}
            >
              No leídas
            </button>
          </div>
          
          <button 
            className={styles.markAllButton}
            onClick={marcarTodasComoLeidas}
            disabled={notificaciones.every(n => n.leida)}
          >
            <Check size={16} /> Marcar todas como leídas
          </button>
        </div>
      </div>

      {filteredNotifications.length === 0 ? (
        <div className={styles.emptyState}>
          <Bell size={48} className={styles.emptyIcon} />
          <h3>No hay notificaciones</h3>
          <p>{activeFilter === 'unread' ? 
            'No tienes notificaciones sin leer' : 
            'No hay notificaciones para mostrar'}
          </p>
        </div>
      ) : (
        <div className={styles.notificationsList}>
          {filteredNotifications.map(notif => (
            <div 
              key={notif.id} 
              className={`${styles.notificationCard} ${notif.leida ? styles.read : ''}`}
              style={{ borderLeftColor: getBadgeColor(notif.tipo) }}
            >
              <div className={styles.notificationHeader}>
                <div className={styles.notificationType}>
                  {getIcon(notif.tipo)}
                  <span>{notif.tipo.replace('_', ' ')}</span>
                </div>
                <div className={styles.notificationTime}>
                  {new Date(notif.fecha_creacion).toLocaleString('es-ES', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              
              <p className={styles.notificationMessage}>{notif.mensaje}</p>
              
              <div className={styles.notificationFooter}>
                {notif.enlace && (
                  <NavLink 
                    to={notif.enlace} 
                    className={styles.detailsLink}
                    onClick={() => marcarComoLeida(notif.id)}
                  >
                    Ver detalles
                  </NavLink>
                )}
                
                <div className={styles.notificationActions}>
                  {!notif.leida && (
                    <button 
                      onClick={() => marcarComoLeida(notif.id)} 
                      className={styles.actionButton}
                      title="Marcar como leída"
                    >
                      <Check size={16} />
                    </button>
                  )}
                  <button 
                    onClick={() => borrarNotificacion(notif.id)} 
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                    title="Eliminar notificación"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;