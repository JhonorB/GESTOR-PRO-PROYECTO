import { Hexagon, Bell, Search, Menu, UserCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import styles from './Layout.module.css';

// Interface para las props del TopBar
interface TopBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const TopBar = ({ searchTerm, onSearchChange }: TopBarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const navigate = useNavigate(); // Inicializamos useNavigate

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: true })); 
      setDate(now.toLocaleDateString('es-ES', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long' 
      }));
    };
    
    updateDateTime();
    const interval = setInterval(updateDateTime, 60000); 
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
    console.log('Término de búsqueda actual en TopBar:', e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      console.log('Búsqueda enviada desde TopBar (Enter):', searchTerm);
    }
  };

  const handleUserClick = () => {
    navigate('/perfil'); 
  };

  const handleNotificationClick = () => {
    navigate('/notificaciones'); 
  };

  return (
    <header className={`${styles.topBar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.brandContainer}>
        <div className={styles.logoContainer}>
          <Hexagon className={styles.logo} size={32} />
          <div className={styles.logoGlow}></div>
        </div>
        <h1 className={styles.brandTitle}>GestorPro</h1>
      </div>
      
      <div className={styles.dateTimeContainer}>
        <div className={styles.time}>{time}</div>
        <div className={styles.date}>{date}</div>
      </div>
      
      <div className={styles.actionsContainer}>
        <div className={styles.searchContainer}>
          <Search size={20} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Buscar..." 
            className={styles.searchInput}
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
          />
        </div>
        
        <button 
          className={`${styles.actionButton} ${styles.notificationButton}`}
          onClick={handleNotificationClick} 
          title="Ver notificaciones" 
        >
          <Bell size={20} />
          <span className={styles.notificationBadge}>3</span>
        </button>
        
        <button 
          className={`${styles.actionButton} ${styles.userButton}`}
          onClick={handleUserClick}
          title="Ir a mi perfil"
        >
          <UserCircle size={24} />
        </button>
      </div>
      
      <button className={styles.menuButton}>
        <Menu size={24} />
      </button>
    </header>
  );
};

export default TopBar;