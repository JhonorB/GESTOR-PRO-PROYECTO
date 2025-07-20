
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Loader } from 'lucide-react';
import styles from './Auth.module.css';
import { loginConEmail, loginConUsuario } from '../servicios/api';

const LoginPage = () => {
  const navigate = useNavigate();
  const [identificador, setIdentificador] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      let usuariosEncontrados = [];

      usuariosEncontrados = await loginConEmail(identificador, password);

      if (usuariosEncontrados.length === 0) {
        usuariosEncontrados = await loginConUsuario(identificador, password);
      }

      if (usuariosEncontrados.length > 0) {
        const usuario = usuariosEncontrados[0];

        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('usuario', JSON.stringify(usuario));

        navigate('/');
      } else {
        setError('Credenciales incorrectas.');
      }
    } catch (err) {
      setError('Error al conectar con el servidor. Inténtalo de nuevo más tarde.');
      console.error('Error durante el proceso de login:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.glassCard}>
        <div className={styles.profileIcon}>
          <User size={50} color="white" />
        </div>

        <h2 className="text-center mb-4 fs-3 fw-bold">Bienvenido</h2>

        <form onSubmit={handleLogin}>
          {error && <div className="alert alert-danger p-2 mb-3">{error}</div>}

          <div className={styles.inputGroup}>
            <span className={styles.inputIcon}><User size={20} /></span>
            <input
              type="text"
              id="identificador"
              className={styles.inputField}
              placeholder="Correo o Nombre de Usuario"
              value={identificador}
              onChange={(e) => setIdentificador(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className={styles.inputGroup}>
            <span className={styles.inputIcon}><Lock size={20} /></span>
            <input
              type="password"
              id="password"
              className={styles.inputField}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              disabled={isLoading}
            />
          </div>

          <button type="submit" className={styles.actionButton} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader size={20} className="animate-spin" />
                <span>Verificando...</span>
              </>
            ) : (
              'Ingresar'
            )}
          </button>
        </form>

        <div className={styles.bottomLink}>
          <p>¿No tienes cuenta? <Link to="/register">Regístrate</Link></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;