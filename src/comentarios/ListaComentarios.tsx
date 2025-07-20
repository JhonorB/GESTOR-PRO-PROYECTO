import  { useState, useEffect } from 'react';
import type { ComentarioConDetalles } from '../interfaces/interfaces';
import styles from './Comentarios.module.css';
import { Heart, CornerDownRight, Trash2 } from 'lucide-react'; // Asegúrate de que Trash2 esté importado

interface ComentarioWithLikeState extends ComentarioConDetalles {
  likes: number;
  likedByCurrentUser: boolean;
}

interface ListaComentariosProps {
  comentarios: ComentarioConDetalles[];
  onDelete: (id: string) => void;
  currentUserId?: string;
  onStartReply: (userName: string) => void;
}

const ListaComentarios = ({ comentarios, onDelete, currentUserId, onStartReply }: ListaComentariosProps) => {
  const [comentariosConLikes, setComentariosConLikes] = useState<ComentarioWithLikeState[]>(() => {
    return comentarios.map(comentario => ({
      ...comentario,
      likes: Math.floor(Math.random() * 20),
      likedByCurrentUser: false
    }));
  });

  useEffect(() => {
    setComentariosConLikes(prevComentarios => {
      return comentarios.map(newComentario => {
        const existingComentario = prevComentarios.find(c => c.id === newComentario.id);
        if (existingComentario) {
          return {
            ...newComentario,
            likes: existingComentario.likes,
            likedByCurrentUser: existingComentario.likedByCurrentUser
          };
        } else {
          return {
            ...newComentario,
            likes: Math.floor(Math.random() * 20),
            likedByCurrentUser: false
          };
        }
      });
    });
  }, [comentarios]);

  if (!comentarios || comentarios.length === 0) {
    return <p className={styles.noCommentsMessage}>No hay comentarios aún.</p>;
  }

  const handleLikeClick = (idComentario: string) => {
    setComentariosConLikes(prevComentarios => {
      return prevComentarios.map(comentario => {
        if (comentario.id === idComentario) {
          const newLikedState = !comentario.likedByCurrentUser;
          return {
            ...comentario,
            likes: newLikedState ? (comentario.likes || 0) + 1 : (comentario.likes || 0) - 1,
            likedByCurrentUser: newLikedState
          };
        }
        return comentario;
      });
    });
    console.log(`Comentario ${idComentario} ha sido marcado con Me Gusta/Quitado Me Gusta.`);
  };

  const handleReplyButtonClick = (userName: string) => {
    onStartReply(userName);
  };

  const displayedComentarios = comentariosConLikes;

  return (
    <div className={styles.listaContainer}>
      {displayedComentarios.map(comentario => (
        <div key={comentario.id} className={styles.comentarioCard}>
            <div className={styles.avatarContainer}>
                <img 
                    src={comentario.usuario?.avatar_url || 'user.jpg'} 
                    alt={comentario.usuario?.nombre_completo || 'Usuario Desconocido'} 
                    className={styles.avatar} 
                />
            </div>
            
            <div className={styles.comentarioBody}>
                <div className={styles.comentarioHeader}>
                    <span className={styles.autor}>{comentario.usuario?.nombre_completo || 'Usuario Desconocido'}</span>
                    {comentario.usuario_id === currentUserId && (
                      <span className={styles.authorBadge}>Tú</span>
                    )}
                    <span className={styles.fecha}>{new Date(comentario.fecha_creacion).toLocaleString()}</span>
                    
                    <div className={styles.commentActions}>
                        <button 
                          className={`${styles.actionButton} ${comentario.likedByCurrentUser ? styles.liked : ''}`} 
                          title={comentario.likedByCurrentUser ? "Quitar me gusta" : "Me gusta"}
                          onClick={() => handleLikeClick(comentario.id)}
                        >
                            <Heart size={16} />
                            {comentario.likes > 0 && ( 
                                <span className={styles.likeCount}>{comentario.likes}</span>
                            )}
                        </button>
                        <button 
                          className={styles.actionButton} 
                          title="Responder a este comentario"
                          onClick={() => handleReplyButtonClick(comentario.usuario?.nombre_completo || 'Usuario Desconocido')}
                        >
                            <CornerDownRight size={16} />
                        </button>
                    </div>
                </div>
                <p className={styles.contenido}>{comentario.contenido}</p>
            </div>
            {/* --- MOVIDO: Botón de eliminar fuera de commentActions --- */}
            {comentario.usuario_id === currentUserId && (
                <button onClick={() => onDelete(comentario.id)} className={styles.deleteButton} title="Eliminar comentario">
                    <Trash2 size={16} />
                </button>
            )}
        </div>
      ))}
    </div>
  );
};

export default ListaComentarios;