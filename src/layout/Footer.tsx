import styles from './Footer.module.css';
import { Github, Linkedin, Mail } from 'lucide-react'; 

const Footer = () => {
  const currentYear = new Date().getFullYear(); 

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h3 className={styles.sectionTitle}>GestorPro</h3>
          <p className={styles.sectionText}>
            Tu solución integral para la gestión eficiente de proyectos y tareas.
            Organiza, colabora y alcanza tus objetivos.
          </p>
        </div>

       

        <div className={styles.footerSection}>
          <h3 className={styles.sectionTitle}>Contacto</h3>
          <p className={styles.contactInfo}>
            <Mail size={16} className={styles.contactIcon} /> diazmarko502@gmail.com
          </p>
          <div className={styles.socialLinks}>
            <a href="https://github.com/JhonorB/GESTOR-PRO-PROYECTO.git" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} title="Nuestro GitHub">
              <Github size={20} />
            </a>
            <a href="https://github.com/JhonorB" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} title="Nuestro LinkedIn">
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p className={styles.copyright}>
          &copy; {currentYear} GestorPro. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;