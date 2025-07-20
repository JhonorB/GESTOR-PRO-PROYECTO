// src/layout/SidebarLayout.tsx
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import styles from './Sidebar.module.css'

const SidebarLayout = () => {
  return (
    <div className={styles.appContainer}>
      
      <Sidebar />
      
      <main className={styles.pageContent}>
        <Outlet />
      </main>
    </div>
  );
};

export default SidebarLayout;