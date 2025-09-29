# VotoSeguro - Plataforma de Elecciones Electrónicas (Tarea I)


Este documento describe la solución técnica, la arquitectura y los estándares de calidad definidos por el equipo para la implementación de los requerimientos de la Tarea 1 del curso ISW-1411 (Calidad del Software).

---

## 1. Definición de Hecho (Definition of Done - DoD) 🏆

Una Historia de Usuario (HU) o PBI (Product Backlog Item) se considera **HECHO** cuando se cumplen **todos** los siguientes criterios:

1.  **Funcionalidad y Criterios de Aceptación:**
    * Todos los **Criterios de Aceptación** definidos en el PBI de Azure Boards han sido verificados y validados.
    * La funcionalidad es accesible y operativa a través de la **interfaz web**.
    * La funcionalidad interactúa correctamente con la base de datos para garantizar el **almacenamiento persistente**.
    * La funcionalidad está **lista para ser demostrada**.

2.  **Calidad del Código y Arquitectura:**
    * Las **pruebas de unidad** necesarias han sido incluidas y pasan exitosamente.
    * El diseño del código toma en cuenta la **ortogonalidad** y el **bajo acoplamiento**.
    * Se ha realizado una **revisión de código** por al menos un compañero del equipo.

3.  **Trazabilidad y Documentación:**
    * El `commit` en Azure Repos referencia el **PBI correspondiente** en Azure Boards.
    * El PBI está marcado como **Hecho** en Azure Boards.
    * El archivo `README.md` ha sido actualizado.

---

## 2. Notas de la Solución (Arquitectura) ⚙️

* **Plataforma de Desarrollo:**
* **Frontend:** Angular (Typescript)
* **Backend (API):** Node.js con Express.js  

* **Base de Datos Seleccionada:** MongoDB 
* **Diseño de Arquitectura:** 
La solución sigue una arquitectura de capas desacopladas (separación clara entre Frontend y Backend).

* **Capa de Presentación (Frontend):** Desarrollada con Angular, se encarga de la UI/UX y la validación inicial de datos.
* **Capa de Lógica de Negocio (Backend):** Implementada con Node.js/Express, expone una API REST para gestionar la autenticación, el registro de votantes/candidatos, y el procesamiento de la votación.
* **Capa de Persistencia (Base de Datos):** MongoDB, utilizada para el almacenamiento de colecciones (ej. votantes, candidatos, elecciones). Se aplica la ortogonalidad asegurando que la API no dependa del framework de frontend específico y el bajo acoplamiento mediante la comunicación exclusiva vía HTTP/JSON.

---

## 3. Implementación (Deployment) 🚀

* **Pre-requisitos:** 
 Para ejecutar el proyecto localmente, es necesario tener instaladas las siguientes herramientas:
 
* **Node.js** (versión recomendada LTS). 
* **npm** (incluido con Node.js) o **Yarn** para la gestión de paquetes. 
* **Angular CLI** (Instalación global: `npm install -g @angular/cli`). 
* Una instancia de **MongoDB** en la nube en Atlas ejecutándose.

* **Pasos para Ejecutar Localmente:**
### 1. Clonación e Instalación de Dependencias

1. **Clonar el repositorio:** 
```bash
   git clone https://github.com/Jisus2001/VotoSeguro-back.git
   cd [Nombre del Proyecto] 
```
2. **Instalación de dependencias: **
   npm install 

### 2. Configuración de la Base de datos (Mongo Atlas) 
Este proyecto utiliza MongoDB Atlas (en la nube) para la gestión de la base de datos. No es necesario instalar un servidor local de MongoDB.

### 3. **Obtener y configurar la URI de conexión:** 

1. Crear un clúster en MongoDB Atlas.
2. Crear un usuario de base de datos y anotar la contraseña
3. En la configuración de conexión de tu clúster, selecciona "Drivers" y copia la URI de conexión.
4. Abre el archivo db.js en la raíz del proyecto y reemplaza la cadena MONGODB_URI con tu URI, asegurándose de sustituir:

const MONGODB_URI = 'mongodb+srv://username:TU_CONTRASENA_REAL@cluster0.wz8jc2s.mongodb.net/VotoSeguro?retryWrites=true&w=majority&appName=Cluster0';

### 4. Ejecución y Verificación: 
Una vez configurada la URI, puedes iniciar el servidor y verificar la conexión a la base de datos.

1. **Ejecución del servidor:** 
    node server.js

Deberías ver los siguiente mensajes: 
   Servidor escuchando en http://localhost:80 
   Conectado a MongoDB Atlas

### 5. Configuración del frontend:

1.  ** Inicio del servicios**
    ```bash 
        cd ../client # O la ruta donde se encuentre el código de Angular 
        npm install ng serve # Inicia el servidor de desarrollo de Angular
    ```
2. ** Acceso **
Una vez que ambos servidores están corriendo, la aplicación estará disponible en `http://localhost:4200` (puerto predeterminado de Angular). 

## 4. Pruebas ✅

A continuación, se presenta la lista inicial de pruebas requeridas para verificar y validar las Historias de Usuario desarrolladas, siguiendo el formato de caso de validación.

### A. HU 1 - Inicio de Sesión de Votante

| Tipo | Caso de Validación |
| :--- | :--- |
| **Positiva** | Verificar que cuando se ingresan las credenciales válidas de un usuario Administrador, entonces el sistema inicia sesión exitosamente y aplica los permisos de Administrador. |
| **Negativa** | Verificar que cuando se ingresan las credenciales inválidas de un usuario Administrador, entonces el sistema rechaza el acceso y muestra un mensaje claro. |
| **Positiva** | Verificar que cuando se ingresan las credenciales válidas de un usuario Votante, entonces el sistema inicia sesión exitosamente y aplica los permisos de Votante. |
| **Negativa** | Verificar que cuando se ingresan las credenciales inválidas de un usuario Votante, entonces el sistema rechaza el acceso y muestra un mensaje claro. |
| **Negativa** | Verificar que cuando se ingresan una identificación válida y una contraseña incorrecta, entonces el sistema rechaza el acceso y muestra un mensaje claro. |
| **Negativa** | Verificar que cuando se ingresan una identificación inválida y una contraseña válida, entonces el sistema rechaza el acceso y muestra un mensaje claro. |
| **Negativa** | Verificar que cuando se realizan 3 intentos fallidos consecutivos de inicio de sesión, entonces el sistema aplica un bloqueo temporal. |

### B. HU 2 - Registro de Votantes

| Tipo | Caso de Validación |
| :--- | :--- |
| **Positiva** | Verificar que cuando el Administrador ingresa los **datos completos** (cédula, nombre, sede y credenciales) de un nuevo votante, entonces el sistema realiza el registro exitoso. |
| **Negativa** | Verificar que cuando el Administrador intenta ingresar una **cédula que ya existe**, entonces el sistema impide el registro. |
| **Adicional** | Verificar que cuando se realiza un registro exitoso, entonces el sistema solicita la **confirmación de registro** al Administrador. |

