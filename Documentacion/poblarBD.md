# Poblar la base de datos

## Pasos para inicializar la base de datos

### 1️⃣ Levantar el proyecto con Docker
- Ejecutar en la terminal:
  ```sh
  docker-compose up --build
  ```
- Esto:
  - Construye las imágenes de Docker.
  - Levanta los contenedores (base de datos, backend, etc.).

### 2️⃣ Acceder al contenedor de la aplicación
- Identificar el contenedor llamado `node_app`:
  ```sh
  docker ps
  ```
- Acceder al contenedor:
  ```sh
  docker exec -it node_app sh
  ```
  - Ahora estamos dentro del contenedor de Node.js.

### 3️⃣ Ejecutar el script de población
- Dentro del contenedor, ejecutar:
  ```sh
  npm run scriptBD
  ```
- Este script:
  - Se conecta a MongoDB.
  - Limpia las colecciones existentes.
  - Inserta datos de prueba en las colecciones:
    - `users`
    - `races`
    - `registrations`
  - Hashea contraseñas con `bcrypt`.

### 4️⃣ Verificar que los datos se insertaron correctamente
- Salir del contenedor:
  ```sh
  exit
  ```
- Conectarse a la base de datos en otro terminal:
  ```sh
  docker exec -it mongodb mongosh
  ```
- Seleccionar la base de datos:
  ```sh
  use sports
  ```
- Verificar que hay datos en la colección `users`:
  ```sh
  db.users.find().pretty()
  ```
- Verificar que hay datos en la colección `users` accediendo a mongo-express para verlo gráficamente


### 🎉 Base de datos poblada correctamente 🎉
