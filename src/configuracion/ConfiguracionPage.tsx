import { useState, useEffect } from 'react';
import { Moon, Sun, Bell, Settings as SettingsIcon, Check } from 'lucide-react';
import styles from './ConfiguracionPage.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Container } from 'react-bootstrap';

const TEMA_CLAVE_STORAGE = 'appTheme';
const NOTIF_TAREA_ALTA_CLAVE_STORAGE = 'notifTareasAltaPrioridad';

const ConfiguracionPage = () => {
  const [temaActual, setTemaActual] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem(TEMA_CLAVE_STORAGE) as 'light' | 'dark') || 'dark';
  });

  const [recibirNotifTareasAlta, setRecibirNotifTareasAlta] = useState<boolean>(() => {
    const storedPref = localStorage.getItem(NOTIF_TAREA_ALTA_CLAVE_STORAGE);
    return storedPref === 'true';
  });

  useEffect(() => {
    document.body.setAttribute('data-theme', temaActual);
    localStorage.setItem(TEMA_CLAVE_STORAGE, temaActual);
  }, [temaActual]);

  useEffect(() => {
    localStorage.setItem(NOTIF_TAREA_ALTA_CLAVE_STORAGE, String(recibirNotifTareasAlta));
  }, [recibirNotifTareasAlta]);

  const toggleTema = () => {
    setTemaActual(prev => prev === 'light' ? 'dark' : 'light');
  };

  const toggleNotificaciones = () => {
    setRecibirNotifTareasAlta(prev => !prev);
  };

  return (
    <Container className={styles.configuracionPage}>
      <div className={styles.header}>
        <SettingsIcon size={32} className={styles.headerIcon} />
        <h1>Configuración</h1>
      </div>

      <div className={styles.settingsContainer}>
        <Card className={styles.settingCard}>
          <div className={styles.settingHeader}>
            <div className={styles.settingIcon}>
              {temaActual === 'dark' ? <Moon size={24} /> : <Sun size={24} />}
            </div>
            <h2 className={styles.settingTitle}>Tema de la Aplicación</h2>
          </div>
          
          <div className={styles.settingContent}>
            <p className={styles.settingDescription}>
              Personaliza la apariencia de la aplicación según tus preferencias.
            </p>
            
            <div className={styles.toggleContainer}>
              <span className={temaActual === 'light' ? styles.activeTheme : ''}>Claro</span>
              <label className={styles.themeToggle}>
                <input 
                  type="checkbox" 
                  checked={temaActual === 'dark'}
                  onChange={toggleTema}
                />
                <span className={styles.slider}></span>
              </label>
              <span className={temaActual === 'dark' ? styles.activeTheme : ''}>Oscuro</span>
            </div>
          </div>
        </Card>

        <Card className={styles.settingCard}>
          <div className={styles.settingHeader}>
            <div className={styles.settingIcon}>
              <Bell size={24} />
            </div>
            <h2 className={styles.settingTitle}>Notificaciones</h2>
          </div>
          
          <div className={styles.settingContent}>
            <div className={styles.notificationSetting}>
              <div className={styles.notificationInfo}>
                <h3>Alertas de Alta Prioridad</h3>
                <p>
                  Recibe notificaciones para tareas importantes.
                </p>
              </div>
              <label className={styles.switch}>
                <input 
                  type="checkbox" 
                  checked={recibirNotifTareasAlta}
                  onChange={toggleNotificaciones}
                />
                <span className={`${styles.slider} ${styles.round}`}></span>
              </label>
            </div>
          </div>
        </Card>

        <Card className={styles.settingCard}>
          <div className={styles.settingHeader}>
            <div className={styles.settingIcon}>
              <Check size={24} />
            </div>
            <h2 className={styles.settingTitle}>Preferencias Avanzadas</h2>
          </div>
          
          <div className={styles.settingContent}>
            <p className={styles.comingSoon}>
              Más opciones de personalización estarán disponibles pronto.
            </p>
          </div>
        </Card>
      </div>
    </Container>
  );
};

export default ConfiguracionPage;