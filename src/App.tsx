// src/App.tsx
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';

// Importa todos los componentes y layouts
import AppLayout from './layout/AppLayout';
import SidebarLayout from './layout/SidebarLayout';
import HomePage from './home/HomePage';
import TasksPage from './tareas/TasksPage';
import ProyectoPage from './proyectos/ProyectoPage'; 
import CommentsPage from './comentarios/CommentsPage';
import LoginPage from './auth/LoginPage';
import RegisterPage from './auth/RegisterPage';
import ContactoPage from './contacto/ContactoPage';
import Panel from './home/Panel';
import PaginaPerfil from './perfil/PaginaPerfil';
import NotificationsPage from './notificaciones/NotificationsPage';
import ConfiguracionPage from './configuracion/ConfiguracionPage';


// La función que verifica si el usuario está logueado
const isAuthenticated = () => {
  return localStorage.getItem('isLoggedIn') === 'true';
};

// Componente "guardián" general
const ProtectedRoutes = () => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

const router = createBrowserRouter([
  // --- Rutas Públicas ---
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },

  {
    element: <ProtectedRoutes />,
    children: [
      // Grupo 1: Páginas que usan AppLayout (solo TopBar)
      {
        element: <AppLayout />,
        children: [
          { path: '/', element: <HomePage /> },
        ]
      },
      // Grupo 2: Páginas que usan SidebarLayout (con menú lateral)
      {
        element: <SidebarLayout />,
        children: [
          { path: 'tareas', element: <TasksPage /> },
          { path: 'panel', element: <Panel/> },

          { path: 'proyectos', element: <ProyectoPage /> }, 
          { path: 'comentarios', element: <CommentsPage /> },
          { path: 'contacto', element: <ContactoPage /> },

          { path: 'perfil', element: <PaginaPerfil/> }, 
          { path: 'notificaciones', element: <NotificationsPage/> },
          { path: 'configuracion', element: <ConfiguracionPage/> }




        ],
      },
    ],
  },
  {
    path: '*',
    element: <div>404 - Página No Encontrada</div>,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
}

export default App;