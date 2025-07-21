# GESTOR-PRO-PROYECTO

Este proyecto es una aplicación de gestión desarrollada con **React**, **TypeScript** y **Vite**. Ofrece una interfaz de usuario intuitiva para [Añade aquí una breve descripción del propósito principal de tu proyecto, por ejemplo: "gestionar proyectos, tareas y usuarios, con funcionalidades de exportación de datos a PDF y Excel."].

---

## 🚀 Inicio Rápido

Sigue estos pasos para poner en marcha el proyecto en tu máquina local.

### 📋 Prerrequisitos

Asegúrate de tener instalado lo siguiente:

* **Node.js y npm**: Puedes descargarlos desde [nodejs.org](https://nodejs.org/).
* **Git**: Para clonar el repositorio, descárgalo desde [git-scm.com](https://git-scm.com/).

### 💻 Instalación de Dependencias Necesarias

Una vez que clones el repositorio y navegues al directorio del proyecto, ejecuta los siguientes comandos para instalar todas las dependencias necesarias:

1.  **Clona el repositorio:**
    ```bash
    git clone [https://github.com/JhonorB/GESTOR-PRO-PROYECTO.git](https://github.com/JhonorB/GESTOR-PRO-PROYECTO.git)
    ```
2.  **Navega al directorio del proyecto:**
    ```bash
    cd GESTOR-PRO-PROYECTO
    ```
3.  **Instala las dependencias principales del proyecto:**
    ```bash
    npm install
    ```
4.  **Instala librerías adicionales:**
    ```bash
    npm install react-router-dom axios lucide-react bootstrap aos hexagons react-bootstrap
    ```
    * `react-router-dom`: Para la navegación dentro de la aplicación.
    * `axios`: Cliente HTTP para realizar peticiones a la API.
    * `lucide-react`: Colección de iconos para la interfaz de usuario.
    * `bootstrap` y `react-bootstrap`: Frameworks para componentes de UI y estilos responsivos.
    * `aos`: Librería para animaciones al desplazar (Animate On Scroll).
    * `hexagons`: (Si tiene un uso específico, puedes añadir una breve descripción aquí).

5.  **Instala dependencias para la generación y exportación de archivos (PDF/Excel):**
    ```bash
    npm install jspdf jspdf-autotable xlsx file-saver
    ```
6.  **Instala `json-server` globalmente** (necesario para el servidor de desarrollo del API):
    ```bash
    npm install -g json-server
    ```
7.  **Instala tipos para TypeScript (dependencias de desarrollo):**
    ```bash
    npm install --save-dev @types/aos @types/jspdf-autotable
    ```

**Nota sobre Yarn:** Has mencionado `yarn add jspdf jspdf-autotable xlsx file-saver`. Si prefieres usar `yarn` en lugar de `npm`, puedes ejecutar los comandos de `yarn` equivalentes para instalar las dependencias.

---

## ▶️ Cómo Correr la Aplicación

Para que la aplicación funcione completamente, necesitas iniciar tanto el **frontend**, como el **servidor de datos** y el **servidor de subida de archivos**.

### 💻 Iniciar el Frontend

Inicia la aplicación de React en modo de desarrollo:

```bash
npm run dev
```
### 💻 Iniciar el backend

```bash
npm run server
```


