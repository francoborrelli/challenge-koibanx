### **README para el Proyecto Challenge-Koibanx** 🚀

---

### **Descripción** 📄

Challenge-Koibanx es la solución a un challenge técnico.

La infraestructura del proyecto utiliza contenedores Docker para separar las responsabilidades entre la API principal y los workers que procesan las tareas de fondo. Este proyecto también incluye soporte para bases de datos, colas de procesamiento y almacenamiento de datos persistente.

---

### **Estructura del archivo `docker-compose.yml`** 🛠️

El archivo `docker-compose.yml` define los siguientes servicios:

1. **`app`** 🖥️
   Este servicio ejecuta la API principal de la aplicación.

   - Se expone en el puerto `3000`.
   - Ejecuta el comando `yarn run dev` para iniciar el servidor en modo desarrollo.
   - La documentación de la API con Swagger está disponible en: [http://localhost:3000/v1/docs](http://localhost:3000/v1/docs) 📚.

2. **`worker`** 🏗️
   Este servicio ejecuta las tareas de fondo mediante [BullMQ](https://docs.bullmq.io/).

   - Utiliza la misma imagen y configuración básica que el servicio `app`.
   - Ejecuta el comando `yarn run worker`.

3. **`mongodb`** 🗄️
   Servicio para la base de datos MongoDB que almacena las tareas y sus estados.

   - Expuesto en el puerto `27017`.

4. **`redis`** ⚡
   Servicio de Redis para manejar las colas de trabajo de BullMQ.

---

### **Cómo levantar el proyecto** 🚀

1. Asegúrate de tener instalado [Docker](https://www.docker.com/) y [Docker Compose](https://docs.docker.com/compose/). 🐳

2. Clona el repositorio:
   ```bash
   git clone https://github.com/francoborrelli/challenge-koibanx.git
   cd challenge-koibanx
   ```
3. Configura los archivos de entorno:

   - En el directorio raíz, crea un archivo `.env` para configurar las variables de entorno de Docker. Puedes usar el archivo `.env.example` como referencia:

     ```bash
     cp .env.example .env
     ```

   - En la carpeta `.envs`, configura los archivos de entorno específicos para la API. Por ejemplo, puedes tener archivos como `.env.development`, `.env.production`, etc. Asegúrate de que estos archivos contengan las variables necesarias para cada entorno.

4. Levanta los servicios con Docker Compose:

   ```bash
   docker compose build
   docker compose -d
   ```

   Esto descargará las imágenes necesarias, construirá las definidas en el proyecto y levantará los servicios.

5. Una vez que los servicios estén corriendo:

   - La API estará disponible en [http://localhost:3000](http://localhost:3000).
   - Accede a la documentación de Swagger en [http://localhost:3000/v1/docs](http://localhost:3000/v1/docs) 📖.

6. Correr Seeders (Opcional)

   ```bash
   docker compose exec app yarn run seed
   ```

---

### **Cómo correr los tests con Jest** 🧪

1. Asegúrate de que los servicios necesarios estén en ejecución (`mongodb` y `redis`).
2. Accede al contenedor de la aplicación:
   ```bash
   docker compose exec app yarn run test
   ```

---

### **Cómo eliminar los contenedores y volúmenes creados** 🗑️

Para limpiar el entorno, sigue estos pasos:

1. Detén y elimina todos los contenedores asociados al proyecto:
   ```bash
   docker compose down
   ```
2. Si deseas eliminar también los volúmenes (como los datos de MongoDB y los archivos subidos):
   ```bash
   docker compose down -v
   ```

---

### **Notas adicionales** 📝

- Puedes verificar que los servicios están corriendo con:
  ```bash
  docker ps
  ```
- Si necesitas depurar el código o trabajar con los logs, puedes acceder al contenedor de la aplicación o del worker utilizando:
  ```bash
  docker logs challenge-koibanx-app
  docker logs challenge-koibanx-worker
  ```

---

### **Estructura del Proyecto Challenge-Koibanx** 📂

#### **Carpetas principales**:

1. **`.envs`**
   Contiene las configuraciones de entorno organizadas por perfiles, como desarrollo, producción, etc. Ayuda a gestionar variables de entorno de forma segura.

2. **`docker`**
   Incluye configuraciones específicas para construir y ejecutar contenedores Docker, como `Dockerfile` y scripts relacionados.

3. **`src`**
   El código fuente principal de la aplicación. Dentro de esta carpeta, encontramos subdirectorios clave:

   - **`config`**
     Contiene configuraciones y utilidades globales, como la configuración de roles y permisos.

   - **`modules`**
     Esta carpeta agrupa funcionalidades específicas de la aplicación organizadas como módulos independientes:

     - **`auth`**: Funcionalidades relacionadas con autenticación y autorización.
     - **`errors`**: Gestión y definición de errores personalizados.
     - **`logger`**: Configuración de logging para monitoreo y debugging.
     - **`paginate`**: Implementación de lógica de paginación para endpoints o consultas.
     - **`swagger`**: Configuración de Swagger para generar la documentación de la API.
     - **`toJSON`**: Utilidades para transformar objetos en formato JSON.
     - **`token`**: Lógica para manejo de tokens (JWT, por ejemplo).
     - **`uploadedTask`**: Funcionalidades específicas para manejar las tareas subidas.
     - **`user`**: Módulo para gestionar usuarios de la aplicación.

   - **`routes/v1`**
     Define las rutas de la API versión 1 (`/v1`) configurando los endpoints disponibles.

   - **`seeders`**
     Contiene scripts para poblar la base de datos con datos iniciales. Dentro de esta carpeta, encontramos:

     - **`userSeed.ts`**: Script para insertar usuarios de prueba o configuración inicial en la base de datos.

   - **`utils`**
     Contiene utilidades y funciones comunes que son reutilizadas a lo largo del proyecto.

   - **`validations`**
     Implementa lógica de validación para datos de entrada, usando la librería `Joi`.

   - **`app.ts`**
     Archivo principal que inicia la aplicación. Aquí se configura y se arranca el servidor Express, incluyendo middleware, rutas, y configuraciones básicas.

   - **`index.ts`**
     Puede ser el punto de entrada que centraliza la inicialización de la aplicación.

   - **`workers.ts`**
     Archivo que define y ejecuta los workers para procesar tareas en segundo plano utilizando BullMQ.

   - ** `seed.ts` **
     Archivo que contiene los seeders para poblar la base de datos con datos iniciales. Este script se ejecuta para insertar datos de prueba o configuración inicial en la base de datos.

---

#### **Archivos principales**:

1. **`.env` y `.env.example`**
   Define variables de entorno necesarias para Docker y Docker-compose. `.env.example` actúa como plantilla para configurar nuevas instancias del proyecto.

2. **`.dockerignore`**
   Lista de archivos y carpetas que Docker debe ignorar al construir imágenes.

3. **`.eslint*` y `.prettier*`**
   Configuración para linters (`ESLint`) y formateadores (`Prettier`) para mantener el código limpio y consistente.

4. **`jest.config.js`**
   Configuración de Jest para pruebas automatizadas.

5. **`.editorconfig`**
   Archivo para mantener la consistencia de estilo entre diferentes editores y entornos de desarrollo.
