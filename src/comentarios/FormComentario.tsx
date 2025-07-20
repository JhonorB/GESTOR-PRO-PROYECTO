// src/comentarios/FormComentario.tsx
import React, { useState } from 'react';
import styles from './Comentarios.module.css';

interface FormProps {
  onCommentCreated: (contenido: string) => void;
}

const FormComentario = ({ onCommentCreated }: FormProps) => {
  const [contenido, setContenido] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!contenido.trim()) return;
    onCommentCreated(contenido);
    setContenido('');
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <textarea
        value={contenido}
        onChange={(e) => setContenido(e.target.value)}
        placeholder="Escribe un comentario..."
        className={styles.formTextarea}
        rows={3}
      />
      <button type="submit" className={styles.formButton}>Comentar</button>
    </form>
  );
};

export default FormComentario;