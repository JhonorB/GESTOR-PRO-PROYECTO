// src/perfil/PaginaPerfil.tsx
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import type { Usuario } from '../interfaces/interfaces';
import { actualizarUsuario } from '../servicios/api';
import './Perfil.css';

const PaginaPerfil = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmarNuevaContrasena, setConfirmarNuevaContrasena] = useState('');
  const [actualizacionExitosa, setActualizacionExitosa] = useState(false);
  const [errorDeActualizacion, setErrorDeActualizacion] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cargarUsuarioDesdeLocalStorage = () => {
      setIsLoading(true);
      try {
        const usuarioData = localStorage.getItem('usuario');
        if (usuarioData) {
          const parsedUsuario: Usuario = JSON.parse(usuarioData);
          setUsuario(parsedUsuario);
          setNuevoNombre(parsedUsuario.nombre_completo);
        } else {
          setErrorDeActualizacion('No se encontró información del usuario en el almacenamiento local. Por favor, inicie sesión.');
        }
      } catch (error) {
        setErrorDeActualizacion('Error al parsear la información del usuario del almacenamiento local.');
        console.error('Error al parsear usuario de localStorage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    cargarUsuarioDesdeLocalStorage();
  }, []);

  const manejarCambioNombre = (evento: React.ChangeEvent<HTMLInputElement>) => {
    setNuevoNombre(evento.target.value);
  };

  const manejarCambioContrasena = (evento: React.ChangeEvent<HTMLInputElement>) => {
    setNuevaContrasena(evento.target.value);
  };

  const manejarCambioConfirmarContrasena = (evento: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmarNuevaContrasena(evento.target.value);
  };

  const manejarEnvio = async (evento: React.FormEvent) => {
    evento.preventDefault();
    setActualizacionExitosa(false);
    setErrorDeActualizacion('');

    if (!usuario) {
      setErrorDeActualizacion('No se pudo cargar la información del usuario para actualizar.');
      return;
    }

    const camposActualizados: Partial<Usuario> = {
      nombre_completo: nuevoNombre,
    };

    if (nuevaContrasena) {
      if (nuevaContrasena === confirmarNuevaContrasena) {
        camposActualizados.contrasena = nuevaContrasena;
      } else {
        setErrorDeActualizacion('Las contraseñas no coinciden.');
        return;
      }
    } else if (confirmarNuevaContrasena) {
        setErrorDeActualizacion('Por favor, ingresa la nueva contraseña en ambos campos si deseas cambiarla.');
        return;
    }

    try {
      const usuarioActualizadoAPI = await actualizarUsuario(usuario.id, camposActualizados);
      
      setUsuario(usuarioActualizadoAPI);
      localStorage.setItem('usuario', JSON.stringify(usuarioActualizadoAPI)); 

      setActualizacionExitosa(true);
      setErrorDeActualizacion('');
      setNuevaContrasena('');
      setConfirmarNuevaContrasena('');
      console.log('Perfil actualizado correctamente.');

    } catch (error) {
      setErrorDeActualizacion('Error al actualizar el perfil. Inténtalo de nuevo.');
      console.error('Error al actualizar el usuario:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando perfil...</p>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <p>Error al cargar el perfil. No se encontró información del usuario.</p>
        <NavLink to="/login" className="login-link">Iniciar sesión</NavLink>
      </div>
    );
  }

  return (
    <div className="perfil-container">
      <div className="perfil-header">
        <h1>Mi Perfil</h1>
        <p className="subtitle">Administra tu información personal</p>
      </div>

      <div className="profile-card">
        <div className="profile-section">
          <div className="avatar-container">
            <img 
              src={usuario.avatar_url || '/images/default-avatar.png'}
              alt="Avatar del usuario" 
              className="avatar" 
            />
          </div>
          
          <div className="user-info">
            <div className="info-item">
              <span className="info-label">Nombre de usuario:</span>
              <span className="info-value">{usuario.nombre_usuario}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Correo electrónico:</span>
              <span className="info-value">{usuario.email}</span>
            </div>
          </div>
        </div>

        <form onSubmit={manejarEnvio} className="profile-form">
          {actualizacionExitosa && (
            <div className="alert success">
              <span>✓</span> Perfil actualizado correctamente
            </div>
          )}
          {errorDeActualizacion && (
            <div className="alert error">
              <span>⚠️</span> {errorDeActualizacion}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="newName">Nombre completo</label>
            <input
              type="text"
              id="newName"
              value={nuevoNombre}
              onChange={manejarCambioNombre}
              placeholder="Ingresa tu nombre completo"
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">Nueva contraseña</label>
            <input
              type="password"
              id="newPassword"
              value={nuevaContrasena}
              onChange={manejarCambioContrasena}
              placeholder="Dejar en blanco para no cambiar"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmNewPassword">Confirmar nueva contraseña</label>
            <input
              type="password"
              id="confirmNewPassword"
              value={confirmarNuevaContrasena}
              onChange={manejarCambioConfirmarContrasena}
              placeholder="Repite la nueva contraseña"
            />
          </div>

          <button type="submit" className="update-btn">
            Guardar cambios
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaginaPerfil;