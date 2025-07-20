// src/servicios/api.ts

import axios from 'axios';
// Importamos las interfaces desde su ubicación.
import type { Tarea, Proyecto, Categoria, Usuario, Comentario, TareaConDetalles, ComentarioConDetalles, AnuncioActualizacion } from '../interfaces/interfaces';

// Creamos una instancia de Axios con la URL base de nuestra API.
const apiClient = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- API de Usuarios ---
export const getUsuarios = async (): Promise<Usuario[]> => {
  try {
    const response = await apiClient.get('/usuarios');
    return response.data;
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    throw error;
  }
};



// Corregido: Acepta el objeto Usuario completo, incluyendo el ID.
export const crearUsuario = async (usuarioData: Usuario): Promise<Usuario> => {
  try {
    const response = await apiClient.post('/usuarios', usuarioData);
    return response.data;
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    throw error;
  }
};



export const actualizarUsuario = async (id: string, usuarioData: Partial<Usuario>): Promise<Usuario> => {
  try {
    const response = await apiClient.patch(`/usuarios/${id}`, usuarioData); // Usamos PATCH para actualizar parcialmente
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    throw error;
  }
};

// --- API de Tareas ---
export const getTareas = async (): Promise<Tarea[]> => {
  try {
    const response = await apiClient.get('/tareas');
    return response.data;
  } catch (error) {
    console.error("Error al obtener las tareas:", error);
    throw error;
  }
};

// Corregido: Acepta el objeto Tarea completo.
export const crearTarea = async (tareaData: Tarea): Promise<Tarea> => {
  try {
    const response = await apiClient.post('/tareas', tareaData);
    return response.data;
  } catch (error) {
    console.error("Error al crear la tarea:", error);
    throw error;
  }
};

// Corregido: El ID ahora es un string.
export const actualizarTarea = async (id: string, tareaData: Partial<Tarea>): Promise<Tarea> => {
  try {
    const response = await apiClient.patch(`/tareas/${id}`, tareaData);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar la tarea:", error);
    throw error;
  }
};

// Corregido: El ID ahora es un string.
export const eliminarTarea = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/tareas/${id}`);
  } catch (error) {
    console.error("Error al eliminar la tarea:", error);
    throw error;
  }
};


// --- API de Proyectos ---
export const getProyectos = async (): Promise<Proyecto[]> => {
    try {
        const response = await apiClient.get('/proyectos');
        return response.data;
    } catch (error) {
        console.error("Error al obtener los proyectos:", error);
        throw error;
    }
};

// --- MODIFICACIÓN: Acepta Omit<Proyecto, 'id'> para la creación ---
export const crearProyecto = async (proyectoData: Omit<Proyecto, 'id'>): Promise<Proyecto> => { // <--- CAMBIO CLAVE AQUÍ
  try {
    const response = await apiClient.post('/proyectos', proyectoData);
    return response.data; // json-server devolverá el Proyecto completo con su ID
  } catch (error) {
    console.error("Error al crear el proyecto:", error);
    throw error;
  }
};

// AÑADE ESTAS DOS FUNCIONES
export const actualizarProyecto = async (id: string, proyectoData: Partial<Proyecto>): Promise<Proyecto> => {
  try {
    const response = await apiClient.patch(`/proyectos/${id}`, proyectoData);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el proyecto:", error);
    throw error;
  }
};

export const eliminarProyecto = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/proyectos/${id}`);
  } catch (error) {
    console.error("Error al eliminar el proyecto:", error);
    throw error;
  }
};



// --- API de Categorías ---
export const getCategorias = async (): Promise<Categoria[]> => {
    try {
        const response = await apiClient.get('/categorias');
        return response.data;
    } catch (error) {
        console.error("Error al obtener las categorías:", error);
        throw error;
    }
};

// --- API de Comentarios ---
export const getComentarios = async (): Promise<Comentario[]> => {
    try {
        const response = await apiClient.get('/comentarios');
        return response.data;
    } catch (error) {
        console.error("Error al obtener los comentarios:", error);
        throw error;
    }
};

// Corregido: Acepta el objeto Comentario completo.
export const crearComentario = async (comentarioData: Comentario): Promise<Comentario> => {
  try {
    const response = await apiClient.post('/comentarios', comentarioData);
    return response.data;
  } catch (error) {
    console.error("Error al crear el comentario:", error);
    throw error;
  }
};
// AÑADE ESTAS DOS FUNCIONES
export const getComentariosConDetalles = async (): Promise<ComentarioConDetalles[]> => {
  try {
    // Ordenamos por fecha para mostrar los más nuevos primero y expandimos el usuario
    const response = await apiClient.get('/comentarios?_sort=fecha_creacion&_order=desc&_expand=usuario');
    return response.data;
  } catch (error) {
    console.error("Error al obtener los comentarios con detalles:", error);
    throw error;
  }
};

export const eliminarComentario = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/comentarios/${id}`);
  } catch (error) {
    console.error("Error al eliminar el comentario:", error);
    throw error;
  }
};
// En /src/servicios/api.ts

// Renombraremos la función original para más claridad
export const loginConEmail = async (email: string, contrasena: string): Promise<Usuario[]> => {
  try {
    const response = await apiClient.get(`/usuarios?email=${email}&contrasena=${contrasena}`);
    return response.data;
  } catch (error) {
    console.error("Error en el login con email:", error);
    throw error;
  }
};

// Añade esta nueva función
export const loginConUsuario = async (nombre_usuario: string, contrasena: string): Promise<Usuario[]> => {
  try {
    const response = await apiClient.get(`/usuarios?nombre_usuario=${nombre_usuario}&contrasena=${contrasena}`);
    return response.data;
  } catch (error) {
    console.error("Error en el login con usuario:", error);
    throw error;
  }
};




// AÑADE ESTA NUEVA FUNCIÓN
export const getTareasConDetalles = async (): Promise<TareaConDetalles[]> => {
  try {
    // _expand=categoria le dice a json-server que también traiga el objeto completo de la categoría
    const response = await apiClient.get('/tareas?_expand=categoria&_expand=proyecto');
    return response.data;
  } catch (error) {
    console.error("Error al obtener las tareas con detalles:", error);
    throw error;
  }

  
};

export const getTareasDeUsuarioConDetalles = async (usuarioId: string): Promise<TareaConDetalles[]> => {
  try {
    // Le pedimos a la API las tareas que tengan este usuario_id específico
    const response = await apiClient.get(`/tareas?usuario_id=${usuarioId}&_expand=categoria&_expand=proyecto`);
    return response.data;
  } catch (error)
 {
    console.error("Error al obtener las tareas del usuario:", error);
    throw error;
  }
 };

 
// AÑADE ESTA NUEVA FUNCIÓN
export const getProyectosDeUsuario = async (usuarioId: string): Promise<Proyecto[]> => {
  try {
    const response = await apiClient.get(`/proyectos?usuario_id=${usuarioId}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los proyectos del usuario:", error);
    throw error;
  }
};



// --- NUEVA API PARA ANUNCIOS DE ACTUALIZACIÓN DEL SISTEMA ---
export const getAnunciosActualizacion = async (): Promise<AnuncioActualizacion[]> => {
  try {
    // Ordenamos por fecha de publicación para obtener los más recientes primero
    const response = await apiClient.get('/actualizaciones_sistema?_sort=fecha_publicacion&_order=desc');
    return response.data;
  } catch (error) {
    console.error("Error al obtener los anuncios de actualización:", error);
    throw error;
  }
};

// Puedes añadir funciones para crear, actualizar, eliminar anuncios si tienes un panel de admin
export const crearAnuncioActualizacion = async (anuncioData: AnuncioActualizacion): Promise<AnuncioActualizacion> => {
  try {
    const response = await apiClient.post('/actualizaciones_sistema', anuncioData);
    return response.data;
  } catch (error) {
    console.error("Error al crear el anuncio de actualización:", error);
    throw error;
  }
};

