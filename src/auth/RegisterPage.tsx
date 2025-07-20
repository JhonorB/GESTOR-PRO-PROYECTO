import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, AtSign, Loader } from 'lucide-react';
import styles from './Auth.module.css';

import { crearUsuario, getUsuarios } from '../servicios/api';
import type { Usuario } from '../interfaces/interfaces';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [nombreCompleto, setNombreCompleto] = useState('');
    const [nombreUsuario, setNombreUsuario] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const usuariosActuales = await getUsuarios();
            const nuevoId = `U${usuariosActuales.length + 1}`;

            const nuevoUsuario: Usuario = { 
                id: nuevoId, 
                nombre_completo: nombreCompleto,
                nombre_usuario: nombreUsuario,
                email: email,
                contrasena: password,
                avatar_url: "user.jpg"
            };

            await crearUsuario(nuevoUsuario);

            setIsSuccess(true);

            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            setError('No se pudo completar el registro. Inténtalo de nuevo.');
            console.error(err);
            setIsSubmitting(false);
        } finally {
            if (!isSuccess) {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <div className={styles.authContainer}>
            <div className={styles.glassCard}>
                {isSuccess ? (
                    <div className={styles.successOverlay}>
                        <svg className={styles.successCheck} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                            <circle className={styles.successCheckCircle} cx="26" cy="26" r="25" fill="none" />
                            <path className={styles.successCheckMark} fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                        </svg>
                        <h3 className="mt-4 fs-4">¡Registro Exitoso!</h3>
                        <p className="text-white-50">Serás redirigido al login...</p>
                    </div>
                ) : (
                    <>
                        <div className={styles.profileIcon}>
                            <User size={50} color="white" />
                        </div>
                        <h2 className="text-center mb-4 fs-3 fw-bold">Crear Cuenta</h2>
                        <form onSubmit={handleRegister} style={{ opacity: isSubmitting ? 0.5 : 1 }}>
                            {error && <div className="alert alert-danger p-2 mb-3">{error}</div>}

                            <div className={styles.inputGroup}>
                                <span className={styles.inputIcon}><User size={20} /></span>
                                <input type="text" className={styles.inputField} placeholder="Nombre Completo" value={nombreCompleto} onChange={(e) => setNombreCompleto(e.target.value)} required disabled={isSubmitting} />
                            </div>

                            <div className={styles.inputGroup}>
                                <span className={styles.inputIcon}><AtSign size={20} /></span>
                                <input type="text" className={styles.inputField} placeholder="Nombre de Usuario" value={nombreUsuario} onChange={(e) => setNombreUsuario(e.target.value)} required disabled={isSubmitting} />
                            </div>

                            <div className={styles.inputGroup}>
                                <span className={styles.inputIcon}><Mail size={20} /></span>
                                <input type="email" className={styles.inputField} placeholder="Correo Electrónico" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isSubmitting} />
                            </div>
                            <div className={styles.inputGroup}>
                                <span className={styles.inputIcon}><Lock size={20} /></span>
                                <input type="password" className={styles.inputField} placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isSubmitting} />
                            </div>
                            <div className={styles.inputGroup}>
                                <span className={styles.inputIcon}><Lock size={20} /></span>
                                <input type="password" className={styles.inputField} placeholder="Confirmar Contraseña" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required disabled={isSubmitting} />
                            </div>

                            <button type="submit" className={styles.actionButton} style={{ marginTop: '1rem' }} disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader size={20} className="animate-spin" />
                                        <span>Registrando...</span>
                                    </>
                                ) : (
                                    'Registrarse'
                                )}
                            </button>
                        </form>
                        <div className={styles.bottomLink}>
                            <p>¿Ya tienes una cuenta? <Link to="/login">Inicia Sesión</Link></p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default RegisterPage;