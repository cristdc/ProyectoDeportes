# ProyectoDeportes

## 📌 Tabla de Contenidos
1. [Introducción](#documentación-de-la-base-de-datos)
2. [¿Por qué MongoDB y no SQL?](#¿por-qué-mongodb-y-no-una-base-de-datos-relacional)
3. [Diseño de la Base de Datos](#diseño-de-la-base-de-datos)
   - [Usuarios (`users`)](#usuarios-users)
   - [Carreras (`races`)](#carreras-races)
   - [Registros (`registrations`)](#registros-registrations)



# Documentación de la Base de Datos

Esta documentación describe la estructura de la base de datos para la plataforma de inscripción y gestión de carreras multideporte.

#  ¿Por qué MongoDB y no una base de datos relacional?


### **1️⃣ Modelo de datos más intuitivo**
- En lugar de manejar múltiples tablas relacionadas con claves foráneas, MongoDB permite almacenar información anidada dentro de un solo documento.
- Por ejemplo, una carrera puede incluir dentro del mismo documento los inscritos, sus tiempos y posiciones.

### **2️⃣ Rendimiento optimizado para consultas frecuentes**
- Las aplicaciones suelen necesitar consultar información rápida y eficientemente.
- En SQL, sería necesario realizar múltiples JOINs para obtener los datos de un usuario, su historial de carreras y resultados.
- En MongoDB, todo esto se puede recuperar en una sola consulta con la estructura correcta.

### **3️⃣ Escalabilidad horizontal**
- En caso de que el sistema necesite soportar más usuarios y carreras, MongoDB se adapta fácilmente a entornos distribuidos sin pérdida de rendimiento.
- Las bases de datos relacionales requieren particionamiento manual y configuración avanzada para lograr lo mismo.

### **4️⃣ Menos mantenimiento en modificaciones de esquema**
- Un sistema en evolución necesita adaptarse a cambios en los requisitos de negocio.
- Con SQL, cada cambio implica una migración de datos potencialmente peligrosa.
- MongoDB permite modificar documentos sin afectar la compatibilidad con datos existentes.

### **5️⃣ Compatibilidad con API REST y aplicaciones web/móviles**
- MongoDB almacena datos en formato JSON, lo que facilita la integración con aplicaciones frontend y backend basadas en JavaScript.
- Las APIs RESTful pueden trabajar directamente con los datos sin necesidad de transformaciones adicionales.

---

## 🔹 **Conclusión**
MongoDB es la mejor opción para este proyecto debido a su **flexibilidad, escalabilidad, menor sobrecarga en consultas y facilidad de integración con API REST y aplicaciones modernas**. 


---

## Diseño de la Base de Datos

### **Relación entre colecciones**
- Un **usuario** puede inscribirse en varias **carreras**.  
- Una **carrera** puede tener varios **participantes**.  
- `registrations` es la colección intermedia que asocia a los usuarios con las carreras.  



## USUARIOS (`users`)
Esta colección almacena los datos de los usuarios registrados en la plataforma, ya sean participantes o administradores.

### **Estructura del Documento**
```json
{
  "_id": ObjectId,
  "name": "Juan Pérez",
  "email": "juanperez@example.com",
  "password": "hashed_password",
  "role": "user",
  "age": 30,
  "gender": "male",
  "registeredAt": "2024-02-27T10:00:00Z"
}
```

### **Descripción de los Campos**
| Campo         | Tipo      | Descripción |
|--------------|----------|-------------|
| `_id`        | ObjectId | Identificador único del usuario. |
| `name`       | String   | Nombre del usuario. |
| `email`      | String   | Correo electrónico del usuario (debe ser único). |
| `password`   | String   | Contraseña encriptada para autenticación. |
| `role`       | String   | Puede ser `"user"` (participante) o `"admin"` (administrador). |
| `age`        | Number   | Edad del usuario (puede ser usada para clasificaciones). |
| `gender`     | String   | Género del usuario (`"male"`, `"female"`, `"other"`). |
| `registeredAt` | Date   | Fecha en la que el usuario se registró en la plataforma. |

---

## CARRERAS (`races`)
Esta colección almacena la información sobre las carreras disponibles en la plataforma.

### **Estructura del Documento**
```json
{
  "_id": ObjectId,
  "name": "Maratón de Madrid",
  "sport": "running",
  "date": "2024-05-15T09:00:00Z",
  "location": "Madrid, España",
  "distance": 42.195,
  "maxParticipants": 5000,
  "unevenness": 500,
  "tour": "URL del archivo GPX",
  "qualifyingTime": "02:30:00",
  "classification":[
    {
      "corredor1" : "",
      "tiempo": 5
    
    },
    {
      "corredor2" : "",
      "tiempo": 10
    
    },
  ],
  "createdBy": ObjectId("admin_id"),
  "status": "open",
  "createdAt": "2024-02-27T10:00:00Z"
}
```

### **Descripción de los Campos**
| Campo         | Tipo      | Descripción |
|--------------|----------|-------------|
| `_id`        | ObjectId | Identificador único de la carrera. |
| `name`       | String   | Nombre de la carrera. |
| `sport`      | String   | Tipo de deporte (`"running"`, `"trail"`, `"cycling"`). |
| `date`       | Date     | Fecha y hora del evento. |
| `location`   | String   | Ubicación donde se realiza la carrera. |
| `distance`   | Number   | Distancia de la carrera en kilómetros. |
| `maxParticipants` | Number | Número máximo de participantes permitidos. |
| `unevenness` | Number   | Desnivel total en metros. |
| `tour`       | String   | URL o referencia a un archivo GPX con la ruta. |
| `qualifyingTime` | String | Tiempo de clasificación necesario |
| `classification`     | Array    | Lista de IDs de los ganadores. |
| `createdBy`  | ObjectId | ID del administrador que creó la carrera. |
| `status`     | String   | Estado de la carrera (`"open"`, `"closed"`, `"finished"`). |
| `createdAt`  | Date     | Fecha en la que se registró la carrera en la plataforma. |

---

## REGISTROS (`registrations`)
Esta colección almacena las inscripciones de los usuarios en las carreras, es la tabla itermedia entre users y races.

### **Estructura del Documento**
```json
{
  "_id": ObjectId,
  "userId": ObjectId("user_id"),
  "raceId": ObjectId("race_id"),
  "dorsal": null,
  "registeredAt": "2024-03-01T08:00:00Z",
  "status": "registered",
  "time": null,
  "position": null,
  "awards": []
}
```

### **Descripción de los Campos**
| Campo         | Tipo      | Descripción |
|--------------|----------|-------------|
| `_id`        | ObjectId | Identificador único de la inscripción. |
| `userId`     | ObjectId | ID del usuario que se inscribe. |
| `raceId`     | ObjectId | ID de la carrera en la que se inscribe. |
| `dorsal`     | Number | Numero del corredor en la carrera. |
| `registeredAt` | Date   | Fecha y hora de la inscripción. |
| `status`     | String   | Estado de la inscripción (`"registered"`, `"cancelled"`, `"finished"`). |
| `time`       | String   | Tiempo registrado en la carrera (si finaliza). |
| `position`   | Number   | Posición final en la carrera (si aplica). |
| `awards`     | Array    | Lista de premios obtenidos. |

---



## 📌 Ejemplos de Consultas en MongoDB

### **1️⃣ Obtener todos los usuarios**
```js
db.users.find({})
```

### **2️⃣ Obtener las carreras abiertas**
```js
db.races.find({ status: "open" })
```

### **3️⃣ Inscribir un usuario en una carrera**
```js
db.registrations.insertOne({
  userId: ObjectId("user_id"),
  raceId: ObjectId("race_id"),
  registeredAt: new Date(),
  status: "registered"
})
```

---

## 📌 Definición de Endpoints
Estos son los endpoints que permitirán interactuar con la API:

### **Usuarios (`/users`)**
- `POST /users/register` → Registro de usuario.
- `POST /users/login` → Inicio de sesión.
- `POST /users/logout` → Cerrar sesión.
- `GET /users/profile` → Obtener el usuario autenticado (según el token).
- `GET /users/:id` → Obtener usuario por ID.
- `GET /users?name=Juan` → Buscar usuarios por nombre.
- `PUT /users/:id` → Actualizar información de usuario.
- `DELETE /users/:id` → Eliminar usuario.
- `GET /admin/users` → Listar todos los usuarios (solo admins).

### **Carreras (`/races`)**
- `GET /races` → Listar todas las carreras.
- `GET /races?date=YYYY-MM-DD` → Obtener carreras en una fecha específica.
- `GET /races?location=Madrid` → Filtrar por ubicación.
- `GET /races?sport=Ciclismo` → Filtrar por tipo de deporte.
- `POST /races` → Crear una nueva carrera (admin).
- `GET /races/:id` → Obtener detalles de una carrera específica.
- `PUT /races/:id` → Actualizar datos de una carrera (admin).
- `PUT /races/:id` → Eliminar una carrera (admin). (state = cancelled)
- `POST /races/:id/results` → Registrar resultados de una carrera.
- `GET /races/:id/results` → Consultar los resultados de una carrera.

### **Inscripciones (`/registrations`)**
- `POST /registrations` → Inscribir a un usuario en una carrera.
- `GET /registrations/:userId` → Obtener inscripciones de un usuario.
- `PUT /registrations/:id/time` → Registrar el tiempo final de un usuario en una carrera.
- `PUT /registrations/:id` → Cancelar una inscripción. (state = cancelled)

### **Panel de administración (`/admin`)**
- `GET /admin/stats` → Obtener métricas del sistema (usuarios registrados, carreras activas, inscripciones).

---




