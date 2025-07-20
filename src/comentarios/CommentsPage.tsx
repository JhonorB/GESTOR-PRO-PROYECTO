import { useState, useEffect } from 'react';
import FormComentario from './FormComentario';
import ListaComentarios from './ListaComentarios';
import { getComentariosConDetalles, crearComentario, eliminarComentario } from '../servicios/api';
import type { Comentario, ComentarioConDetalles, Usuario } from '../interfaces/interfaces';
import styles from './Comentarios.module.css';

const CommentsPage = () => {
  const [comentarios, setComentarios] = useState<ComentarioConDetalles[]>([]);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usuarioData = localStorage.getItem('usuario');
    if (usuarioData) {
      setUsuario(JSON.parse(usuarioData));
    }
    
    const cargarComentarios = async () => {
      try {
        const data = await getComentariosConDetalles();
        setComentarios(data);
      } catch (error) {
        console.error("No se pudieron cargar los comentarios.", error);
      } finally {
        setLoading(false);
      }
    };
    cargarComentarios();
  }, []);

  const handleCommentCreated = async (contenido: string) => {
    if (!usuario) {
      alert("Debes iniciar sesión para comentar.");
      return;
    }
    try {
      const nuevoComentario: Comentario = {
        id: `CM${Date.now()}`,
        contenido,
        usuario_id: usuario.id,
        fecha_creacion: new Date().toISOString(),
      };
      await crearComentario(nuevoComentario);
      
      const comentarioParaLista: ComentarioConDetalles = { ...nuevoComentario, usuario };
      setComentarios(prev => [comentarioParaLista, ...prev]);
    } catch (error) {
      alert("Error al crear el comentario.");
      console.error(error);
    }
  };

  const handleCommentDeleted = async (idComentario: string) => {
    if (window.confirm('¿Seguro que quieres eliminar este comentario?')) {
      try {
        await eliminarComentario(idComentario);
        setComentarios(prev => prev.filter(c => c.id !== idComentario));
      } catch (error) {
        alert("Error al eliminar el comentario.");
        console.error(error);
      }
    }
  };

  const handleStartReply = (userName: string) => {
    alert(`Para responder a @${userName}, usa el campo de comentario principal.`);
  };

  return (
    <div className={styles.commentsPageContainer}>
      <h1 className={styles.pageTitle}>Comentarios Globales</h1>
      <FormComentario onCommentCreated={handleCommentCreated} />
      <hr className={styles.divider} />
      {loading ? <p className={styles.loadingMessage}>Cargando comentarios...</p> : 
        <ListaComentarios 
          comentarios={comentarios}
          onDelete={handleCommentDeleted}
          currentUserId={usuario?.id}
          onStartReply={handleStartReply}
        />
      }
    </div>
  );
};

export default CommentsPage;