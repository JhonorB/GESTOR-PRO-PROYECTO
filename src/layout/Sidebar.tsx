import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, LayoutDashboard, FolderKanban, MessageSquare, User, Settings, Bell, Search, LogOut, Hexagon, Phone, PanelTop } from 'lucide-react';
import styles from './Sidebar.module.css';
import type { Usuario } from '../interfaces/interfaces';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/panel', label: 'Panel', icon: PanelTop },
  { path: '/tareas', label: 'Tareas', icon: LayoutDashboard },
  { path: '/proyectos', label: 'Proyectos', icon: FolderKanban },
  { path: '/comentarios', label: 'Comentarios', icon: MessageSquare },
  { path: '/contacto', label: 'Contacto', icon: Phone },
  { path: '/perfil', label: 'Perfil', icon: User },
  { path: '/configuracion', label: 'Configuración', icon: Settings },
];

const Sidebar = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioData = localStorage.getItem('usuario');
    if (usuarioData) {
      setUsuario(JSON.parse(usuarioData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredNavItems = navItems.filter(item => 
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <Hexagon size={28} />
        <span className={styles.brandName}>GestorPro</span>
      </div>

      <div className={styles.searchBar}>
        <Search size={18} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <nav className={styles.sidebarNav}>
        <ul>
          {filteredNavItems.length > 0 ? (
            filteredNavItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                  }
                  end={item.path === '/'}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))
          ) : (
            <li className={styles.noResultsMessage}>
              <span>No hay resultados para "{searchTerm}"</span>
            </li>
          )}
        </ul>
      </nav>

      <div className={styles.sidebarFooter}>
        <ul>
          <li>
            <NavLink to="/notificaciones" className={styles.navLink}>
              <Bell size={20} /><span>Notificaciones</span>
            </NavLink>
          </li>
      
        </ul>

        <div className={styles.userProfile}>
          <img src={usuario?.avatar_url || 'user.jpg'} alt="Avatar" />
          <div className={styles.userInfo}>
            <span className={styles.userName}>{usuario?.nombre_completo || 'Usuario'}</span>
            <span className={styles.userEmail}>{usuario?.email || ''}</span>
          </div>
          <button onClick={handleLogout} className={styles.logoutButton}>
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;