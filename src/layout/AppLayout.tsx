
import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import TopBar from './TopBar.tsx';
import styles from './Layout.module.css';
import Footer from './Footer.tsx';

const AppLayout = () => {

  const [searchTerm, setSearchTerm] = useState('');


  useEffect(() => {
    console.log("AppLayout: El término de búsqueda global ha cambiado a:", searchTerm);
  }, [searchTerm]);

  return (
    <div className={styles.appContainer}>

      <TopBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <main className={styles.pageContent}>

        <Outlet context={{ searchTerm }} />
      <Footer/>
      </main>
    </div>
  );
};

export default AppLayout;