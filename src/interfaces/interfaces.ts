
//Estructura de Usuario.
export interface Usuario {
  id: string; 
  nombre_completo: string;
  nombre_usuario: string;
  email: string;
  contrasena: string;
  avatar_url: string;
}

// Estructura de la Categoría de las tareas.
export interface Categoria {
  id: string; 
  nombre: string;
}

//Estructura del proyecto.
export interface Proyecto {
  id: string; 
  nombre: string;
  descripcion: string;
  usuario_id: string; // Corregido
  estado: 'Planificado' | 'En Progreso' | 'En Pausa' | 'Completado';
  fecha_creacion: string;
  fecha_fin_estimada: string;
}

//Estructura de la tarea.
export interface Tarea {
  id: string; 
  titulo: string;
  descripcion: string;
  prioridad: 'Alta' | 'Media' | 'Baja';
  completada: boolean;
  categoria_id: string; 
  proyecto_id: string | null; 
  usuario_id: string; 
  fecha_creacion: string;
  fecha_vencimiento: string;
}

// Estructura del Comentario.
export interface Comentario {
  id: string;
  contenido: string;
  usuario_id: string; 
  fecha_creacion: string;
}

export interface ComentarioConDetalles extends Comentario {
  usuario?: Usuario;
}
export interface TareaConDetalles extends Tarea {
  categoria?: Categoria; 
  proyecto?: Proyecto;   
}




export interface RecentActivityItem {
  id: number;
  type: 'tarea' | 'proyecto' | 'comentario' | 'usuario' | string; 
  description: string;
  time: string;
}
export interface RecentActivityItem {
  id: number;
  type: 'tarea' | 'proyecto' | 'comentario' | 'usuario' | string; 
  description: string;
  time: string;
}


// INTERFAZ PARA ANUNCIOS DE ACTUALIZACIÓN DEL SISTEMA ---
export interface AnuncioActualizacion {
  id: string; 
  titulo: string; 
  contenido: string;
  fecha_publicacion: string; 
  version?: string; 
  enlace_mas_info?: string; 
}

export interface Notificacion {
  id: string; 
  tipo: 'sistema' | 'tarea_alta_prioridad' | 'recordatorio' | 'general'; 
  mensaje: string; 
  fecha_creacion: string;
  leida: boolean; 
  enlace?: string; 
  referenciaId?: string; 
}