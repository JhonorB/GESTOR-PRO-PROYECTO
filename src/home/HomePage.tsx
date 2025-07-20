import { useEffect, useState } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { ClipboardList, FolderKanban, User, MessageSquare, Mail, Settings, LogOut } from 'lucide-react';
import styles from './HomePage.module.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import type { Usuario } from '../interfaces/interfaces';

interface OutletContextType {
    searchTerm: string;
}

const ALL_DASHBOARD_ITEMS = [
    { path: '/tareas', icon: ClipboardList, title: 'Gestor de Tareas', description: 'Visualiza y gestiona tus tareas.' },
    { path: '/proyectos', icon: FolderKanban, title: 'Gestor de Proyectos', description: 'Organiza tus proyectos.' },
    { path: '/perfil', icon: User, title: 'Mi Perfil', description: 'Edita tu información personal.' },
    { path: '/comentarios', icon: MessageSquare, title: 'Comentarios', description: 'Revisa la actividad global.' },
    { path: '/contacto', icon: Mail, title: 'Contacto', description: 'Ponte en contacto con soporte.' },
    { path: '/configuracion', icon: Settings, title: 'Configuración', description: 'Ajusta las preferencias.' },
    { path: 'logout', icon: LogOut, title: 'Cerrar Sesión', description: 'Salir y volver a iniciar sesión.' },
];

const HomePage = () => {
    const [displayUserName, setDisplayUserName] = useState('Usuario');
    const navigate = useNavigate();

    const { searchTerm } = useOutletContext<OutletContextType>();

    const [filteredDashboardItems, setFilteredDashboardItems] = useState(ALL_DASHBOARD_ITEMS);


    useEffect(() => {
        AOS.init();

        const usuarioData = localStorage.getItem('usuario');
        if (usuarioData) {
            try {
                const usuario: Usuario = JSON.parse(usuarioData);
                if (usuario.nombre_completo) {
                    setDisplayUserName(usuario.nombre_completo);
                } else if (usuario.nombre_usuario) {
                    setDisplayUserName(usuario.nombre_usuario);
                }
            } catch (error) {
                console.error("Error al parsear usuario de localStorage en HomePage:", error);
                setDisplayUserName('Usuario');
            }
        }
    }, []);

    useEffect(() => {
        console.log("HomePage: searchTerm recibido del Outlet (cambió):", searchTerm);

        if (searchTerm.trim() === '') {
            setFilteredDashboardItems(ALL_DASHBOARD_ITEMS);
        } else {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            const filtered = ALL_DASHBOARD_ITEMS.filter(item =>
                item.title.toLowerCase().includes(lowerCaseSearchTerm) ||
                item.description.toLowerCase().includes(lowerCaseSearchTerm)
            );
            setFilteredDashboardItems(filtered);
        }
    }, [searchTerm]);


    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('usuario');
        navigate('/login');
    };

    return (
        <div className={`${styles.container} container-fluid`}>
            <div className="text-center mb-5">
                <h1 className={`${styles.welcomeTitle} text-white mb-2`}>Bienvenido, <span className={styles.userName}>{displayUserName}</span></h1>
                <p className={`${styles.welcomeSubtitle} text-white-50 mb-5`}>Selecciona un módulo para comenzar</p>
            </div>

            <div className="row g-4">
                {filteredDashboardItems.length > 0 ? (
                    filteredDashboardItems.map((item, index) => (
                        <div
                            key={item.path}
                            className="col-12 col-md-6 col-lg-4"
                            data-aos="fade-up"
                            data-aos-delay={index * 50}
                            data-aos-duration="600"
                        >
                            {item.path === 'logout' ? (
                                <div onClick={handleLogout} className={`${styles.navCard} card h-100`}>
                                    <div className="card-body text-center p-4">
                                        <div className={styles.iconWrapper}>
                                            <item.icon className={styles.icon} size={40} />
                                        </div>
                                        <h2 className={`${styles.cardTitle} card-title mt-4`}>{item.title}</h2>
                                        <p className={`${styles.cardDescription} card-text`}>{item.description}</p>
                                    </div>
                                </div>
                            ) : (
                                <Link to={item.path} className={`${styles.navCard} card h-100`}>
                                    <div className="card-body text-center p-4">
                                        <div className={styles.iconWrapper}>
                                            <item.icon className={styles.icon} size={40} />
                                        </div>
                                        <h2 className={`${styles.cardTitle} card-title mt-4`}>{item.title}</h2>
                                        <p className={`${styles.cardDescription} card-text`}>{item.description}</p>
                                    </div>
                                </Link>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="col-12 text-center text-white">
                        <p className={styles.noResults}>No se encontraron módulos que coincidan con su búsqueda "{searchTerm}".</p> {/* Mensaje si no hay coincidencias */}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;