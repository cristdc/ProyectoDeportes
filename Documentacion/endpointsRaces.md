# 📌 Documentación de Endpoints de Carreras

Esta documentación explica cómo probar los endpoints de `races` en **Thunder Client** (o Postman)

---

## 🔹 **1. Listar Todas las Carreras**

### **📌 GET /races**

📌 **Descripción:** Obtiene la lista de todas las carreras activas en el sistema.

🔹 **URL Completa:**
```
http://localhost:3000/api/races
```

🔹 **Ejemplo de Respuesta (200 - OK):**
```json
[
  {
    "_id": "67c5f0baa3b5234796ec17ee",
    "name": "Maratón de Primavera",
    "sport": "running",
    "date": "2025-05-15T09:00:00Z",
    "location": "Parque Central",
    "distance": 42.2,
    "maxParticipants": 500,
    "unevenness": 120,
    "tour": "Parque Central - Avenida Principal - Costanera - Parque Central",
    "qualifyingTime": "04:00:00",
    "status": "open",
    "createdAt": "2025-03-05T14:35:20.123Z"
  },
  {
    "_id": "67c5f0baa3b5234796ec17ef",
    "name": "Vuelta Ciclista",
    "sport": "cycling",
    "date": "2025-06-20T08:30:00Z",
    "location": "Montaña Alta",
    "distance": 120.5,
    "maxParticipants": 200,
    "unevenness": 1500,
    "tour": "Montaña Alta - Valle - Colina - Montaña Alta",
    "qualifyingTime": "06:00:00",
    "status": "open",
    "createdAt": "2025-03-10T11:20:15.456Z"
  }
]
```

🔹 **Errores posibles:**
- `500`: "Error al obtener las carreras"

---

## 🔹 **2. Filtrar Carreras por Fecha**

### **📌 GET /races/date/:date**

📌 **Descripción:** Obtiene las carreras programadas para una fecha específica.

🔹 **URL Completa:**
```
http://localhost:3000/api/races/date/2025-05-15
```

🔹 **Parámetros de ruta:**
- `date`: Fecha en formato YYYY-MM-DD

🔹 **Ejemplo de Respuesta (200 - OK):**
```json
[
  {
    "_id": "67c5f0baa3b5234796ec17ee",
    "name": "Maratón de Primavera",
    "sport": "running",
    "date": "2025-05-15T09:00:00Z",
    "location": "Parque Central",
    "distance": 42.2,
    "maxParticipants": 500,
    "status": "open"
  }
]
```

🔹 **Errores posibles:**
- `400`: "Formato de fecha inválido"
- `500`: "Error al obtener las carreras"

---

## 🔹 **3. Filtrar Carreras por Ubicación**

### **📌 GET /races/location/:location**

📌 **Descripción:** Obtiene las carreras que se realizarán en una ubicación específica.

🔹 **URL Completa:**
```
http://localhost:3000/api/races/location/Parque
```

🔹 **Parámetros de ruta:**
- `location`: Texto para buscar en las ubicaciones (búsqueda parcial)

🔹 **Ejemplo de Respuesta (200 - OK):**
```json
[
  {
    "_id": "67c5f0baa3b5234796ec17ee",
    "name": "Maratón de Primavera",
    "sport": "running",
    "date": "2025-05-15T09:00:00Z",
    "location": "Parque Central",
    "distance": 42.2,
    "maxParticipants": 500,
    "status": "open"
  },
  {
    "_id": "67c5f0baa3b5234796ec17eg",
    "name": "Carrera 10K",
    "sport": "running",
    "date": "2025-07-10T08:00:00Z",
    "location": "Parque Forestal",
    "distance": 10,
    "maxParticipants": 1000,
    "status": "open"
  }
]
```

🔹 **Errores posibles:**
- `500`: "Error al obtener las carreras"

---

## 🔹 **4. Filtrar Carreras por Deporte**

### **📌 GET /races/sport/:sport**

📌 **Descripción:** Obtiene las carreras filtradas por tipo de deporte.

🔹 **URL Completa:**
```
http://localhost:3000/api/races/sport/running
```

🔹 **Parámetros de ruta:**
- `sport`: Tipo de deporte (running, trailRunning, cycling)

🔹 **Ejemplo de Respuesta (200 - OK):**
```json
[
  {
    "_id": "67c5f0baa3b5234796ec17ee",
    "name": "Maratón de Primavera",
    "sport": "running",
    "date": "2025-05-15T09:00:00Z",
    "location": "Parque Central",
    "distance": 42.2,
    "maxParticipants": 500,
    "status": "open"
  },
  {
    "_id": "67c5f0baa3b5234796ec17eg",
    "name": "Carrera 10K",
    "sport": "running",
    "date": "2025-07-10T08:00:00Z",
    "location": "Parque Forestal",
    "distance": 10,
    "maxParticipants": 1000,
    "status": "open"
  }
]
```

🔹 **Errores posibles:**
- `400`: "Tipo de deporte inválido"
- `500`: "Error al obtener las carreras"

---

## 🔹 **5. Obtener Carrera por ID**

### **📌 GET /races/:id**

📌 **Descripción:** Obtiene los detalles completos de una carrera específica.

🔹 **URL Completa:**
```
http://localhost:3000/api/races/67c5f0baa3b5234796ec17ee
```

🔹 **Ejemplo de Respuesta (200 - OK):**
```json
{
  "_id": "67c5f0baa3b5234796ec17ee",
  "name": "Maratón de Primavera",
  "sport": "running",
  "date": "2025-05-15T09:00:00Z",
  "location": "Parque Central",
  "distance": 42.2,
  "maxParticipants": 500,
  "unevenness": 120,
  "tour": "Parque Central - Avenida Principal - Costanera - Parque Central",
  "qualifyingTime": "04:00:00",
  "createdBy": {
    "_id": "663f1b4667d0d8992e610c85",
    "name": "Admin Usuario",
    "email": "admin@example.com"
  },
  "status": "open",
  "createdAt": "2025-03-05T14:35:20.123Z",
  "__v": 0
}
```

🔹 **Errores posibles:**
- `404`: "Carrera no encontrada"
- `500`: "Error al obtener la carrera"

---

## 🔹 **6. Crear Carrera (Admin)**

### **📌 POST /races**

📌 **Descripción:** Crea una nueva carrera en el sistema.

🔹 **URL Completa:**
```
http://localhost:3000/api/races
```

🔹 **Autenticación:**
Requiere cookie con token JWT de un usuario con rol "admin".

🔹 **Body (JSON):**
```json
{
  "name": "Maratón de Primavera",
  "sport": "running",
  "date": "2025-05-15T09:00:00Z",
  "location": "Parque Central",
  "distance": 42.2,
  "maxParticipants": 500,
  "unevenness": 120,
  "tour": "Parque Central - Avenida Principal - Costanera - Parque Central",
  "qualifyingTime": "04:00:00"
}
```

🔹 **Ejemplo de Respuesta (201 - Creado):**
```json
{
  "message": "Carrera creada exitosamente",
  "race": {
    "_id": "67c5f0baa3b5234796ec17ee",
    "name": "Maratón de Primavera",
    "sport": "running",
    "date": "2025-05-15T09:00:00Z",
    "location": "Parque Central",
    "distance": 42.2,
    "maxParticipants": 500,
    "unevenness": 120,
    "tour": "Parque Central - Avenida Principal - Costanera - Parque Central",
    "qualifyingTime": "04:00:00",
    "createdBy": "663f1b4667d0d8992e610c85",
    "status": "open",
    "createdAt": "2025-03-05T14:35:20.123Z",
    "__v": 0
  }
}
```

🔹 **Errores posibles:**
- `400`: "Datos de carrera inválidos"
- `401`: "No hay token de autenticación" o "Token inválido"
- `403`: "No tienes permisos para acceder a este recurso"
- `500`: "Error al crear la carrera"

---

## 🔹 **7. Actualizar Carrera (Admin)**

### **📌 PUT /races/:id**

📌 **Descripción:** Actualiza la información de una carrera existente.

🔹 **URL Completa:**
```
http://localhost:3000/api/races/67c5f0baa3b5234796ec17ee
```

🔹 **Autenticación:**
Requiere cookie con token JWT de un usuario con rol "admin".

🔹 **Body (JSON):**
```json
{
  "name": "Gran Maratón de Primavera",
  "maxParticipants": 600,
  "status": "closed"
}
```

🔹 **Ejemplo de Respuesta (200 - OK):**
```json
{
  "message": "Carrera actualizada exitosamente",
  "race": {
    "_id": "67c5f0baa3b5234796ec17ee",
    "name": "Gran Maratón de Primavera",
    "sport": "running",
    "date": "2025-05-15T09:00:00Z",
    "location": "Parque Central",
    "distance": 42.2,
    "maxParticipants": 600,
    "unevenness": 120,
    "tour": "Parque Central - Avenida Principal - Costanera - Parque Central",
    "qualifyingTime": "04:00:00",
    "createdBy": "663f1b4667d0d8992e610c85",
    "status": "closed",
    "createdAt": "2025-03-05T14:35:20.123Z",
    "__v": 0
  }
}
```

🔹 **Errores posibles:**
- `400`: "Datos de carrera inválidos"
- `401`: "No hay token de autenticación" o "Token inválido"
- `403`: "No tienes permisos para acceder a este recurso"
- `404`: "Carrera no encontrada"
- `500`: "Error al actualizar la carrera"

---

## 🔹 **8. Eliminar Carrera (Admin)**

### **📌 DELETE /races/:id**

📌 **Descripción:** Elimina una carrera o la marca como eliminada si ya tiene inscripciones.

🔹 **URL Completa:**
```
http://localhost:3000/api/races/67c5f0baa3b5234796ec17ee
```

🔹 **Autenticación:**
Requiere cookie con token JWT de un usuario con rol "admin".

🔹 **Ejemplo de Respuesta (200 - OK):**
```json
{
  "message": "Carrera eliminada exitosamente"
}
```

🔹 **Errores posibles:**
- `401`: "No hay token de autenticación" o "Token inválido"
- `403`: "No tienes permisos para acceder a este recurso"
- `404`: "Carrera no encontrada"
- `500`: "Error al eliminar la carrera"

---

## 🔹 **9. Registrar Resultados de Carrera (Admin)**

### **📌 POST /races/:id/results**

📌 **Descripción:** Registra los resultados de los participantes en una carrera.

🔹 **URL Completa:**
```
http://localhost:3000/api/races/67c5f0baa3b5234796ec17ee/results
```

🔹 **Autenticación:**
Requiere cookie con token JWT de un usuario con rol "admin".

🔹 **Body (JSON):**
```json
{
  "results": [
    {
      "userId": "663f1b4667d0d8992e610c86",
      "time": "03:45:22",
      "position": 1
    },
    {
      "userId": "663f1b4667d0d8992e610c87",
      "time": "03:52:15",
      "position": 2
    },
    {
      "userId": "663f1b4667d0d8992e610c88",
      "time": "04:01:33",
      "position": 3
    }
  ]
}
```

🔹 **Ejemplo de Respuesta (200 - OK):**
```json
{
  "message": "Resultados registrados exitosamente",
  "updatedRace": {
    "_id": "67c5f0baa3b5234796ec17ee",
    "name": "Gran Maratón de Primavera",
    "status": "finished",
    "resultsCount": 3
  }
}
```

🔹 **Errores posibles:**
- `400`: "Datos de resultados inválidos"
- `401`: "No hay token de autenticación" o "Token inválido"
- `403`: "No tienes permisos para acceder a este recurso"
- `404`: "Carrera no encontrada"
- `500`: "Error al registrar los resultados"

---

## 🔹 **10. Obtener Resultados de Carrera**

### **📌 GET /races/:id/results**

📌 **Descripción:** Obtiene los resultados de los participantes en una carrera.

🔹 **URL Completa:**
```
http://localhost:3000/api/races/67c5f0baa3b5234796ec17ee/results
```

🔹 **Ejemplo de Respuesta (200 - OK):**
```json
[
  {
    "_id": "67c5f1baa3b5234796ec17ff",
    "user": {
      "_id": "663f1b4667d0d8992e610c86",
      "name": "Juan Corredor",
      "avatar": "default.jpg"
    },
    "time": "03:45:22",
    "position": 1
  },
  {
    "_id": "67c5f1baa3b5234796ec1800",
    "user": {
      "_id": "663f1b4667d0d8992e610c87",
      "name": "María Atleta",
      "avatar": "default.jpg"
    },
    "time": "03:52:15",
    "position": 2
  },
  {
    "_id": "67c5f1baa3b5234796ec1801",
    "user": {
      "_id": "663f1b4667d0d8992e610c88",
      "name": "Pedro Runner",
      "avatar": "default.jpg"
    },
    "time": "04:01:33",
    "position": 3
  }
]
```

🔹 **Errores posibles:**
- `404`: "Carrera no encontrada"
- `404`: "Esta carrera aún no tiene resultados"
- `500`: "Error al obtener los resultados"

---