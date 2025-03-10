# 📌 Documentación de Endpoints de Carreras

Esta documentación explica cómo probar los endpoints de `races` en **Thunder Client** (o Postman)

---

## 🔹 **1. Listar Todas las Carreras**

### **📌 GET /races**

📌 **Descripción:** Obtiene la lista de todas las carreras activas en el sistema con paginación.

🔹 **URL Completa:**
```
http://localhost:3000/api/races
```

🔹 **Parámetros de consulta opcionales:**
- `page`: Número de página (por defecto: 1)
- `limit`: Número de elementos por página (por defecto: 10)
- `sport`: Filtrar por tipo de deporte (running, trailRunning, cycling)
- `location`: Filtrar por ubicación (búsqueda parcial)

🔹 **Ejemplo de Respuesta (200 - OK):**
```json
{
  "races": [
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
      "classification": [],
      "status": "open",
      "createdAt": "2025-03-05T14:35:20.123Z",
      "createdBy": "663f1b4667d0d8992e610c85",
      "hasRunnersCSV": false,
      "runnersCSVPath": null,
      "lastCSVUpdate": null,
      "hasGPXFile": false,
      "gpxFilePath": null,
      "gpxFileUploadedAt": null,
      "gpxFileName": null
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
      "classification": [],
      "status": "open",
      "createdAt": "2025-03-10T11:20:15.456Z",
      "createdBy": "663f1b4667d0d8992e610c85",
      "hasRunnersCSV": false,
      "runnersCSVPath": null,
      "lastCSVUpdate": null,
      "hasGPXFile": false,
      "gpxFilePath": null,
      "gpxFileUploadedAt": null,
      "gpxFileName": null
    }
  ],
  "pagination": {
    "totalRaces": 45,
    "totalPages": 5,
    "currentPage": 1,
    "limit": 10
  }
}
```

🔹 **Errores posibles:**
- `400`: "Los parámetros de paginación deben ser números positivos"
- `500`: "Error al obtener las carreras"

---

## 🔹 **2. Filtrar Carreras por Fecha**

### **📌 GET /races/date/:date**

📌 **Descripción:** Obtiene las carreras programadas para una fecha específica con paginación.

🔹 **URL Completa:**
```
http://localhost:3000/api/races/date/2025-05-15
```

🔹 **Parámetros de ruta:**
- `date`: Fecha en formato YYYY-MM-DD

🔹 **Parámetros de consulta opcionales:**
- `page`: Número de página (por defecto: 1)
- `limit`: Número de elementos por página (por defecto: 10)

🔹 **Ejemplo de Respuesta (200 - OK):**
```json
{
  "races": [
    {
      "_id": "67c5f0baa3b5234796ec17ee",
      "name": "Maratón de Primavera",
      "sport": "running",
      "date": "2025-05-15T09:00:00Z",
      "location": "Parque Central",
      "distance": 42.2,
      "maxParticipants": 500,
      "classification": [],
      "status": "open"
    }
  ],
  "pagination": {
    "totalRaces": 1,
    "totalPages": 1,
    "currentPage": 1,
    "limit": 10,
    "date": "2025-05-15"
  }
}
```

🔹 **Errores posibles:**
- `400`: "Formato de fecha inválido. Debe ser YYYY-MM-DD"
- `400`: "Los parámetros de paginación deben ser números positivos"
- `404`: "No hay carreras disponibles para esta fecha"
- `500`: "Error al obtener las carreras por fecha"

---

## 🔹 **3. Filtrar Carreras por Ubicación**

### **📌 GET /races/location/:location**

📌 **Descripción:** Obtiene las carreras que se realizarán en una ubicación específica con paginación.

🔹 **URL Completa:**
```
http://localhost:3000/api/races/location/Parque
```

🔹 **Parámetros de ruta:**
- `location`: Texto para buscar en las ubicaciones (búsqueda parcial)

🔹 **Parámetros de consulta opcionales:**
- `page`: Número de página (por defecto: 1)
- `limit`: Número de elementos por página (por defecto: 10)

🔹 **Ejemplo de Respuesta (200 - OK):**
```json
{
  "races": [
    {
      "_id": "67c5f0baa3b5234796ec17ee",
      "name": "Maratón de Primavera",
      "sport": "running",
      "date": "2025-05-15T09:00:00Z",
      "location": "Parque Central",
      "distance": 42.2,
      "maxParticipants": 500,
      "classification": [],
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
      "classification": [],
      "status": "open"
    }
  ],
  "pagination": {
    "totalRaces": 2,
    "totalPages": 1,
    "currentPage": 1,
    "limit": 10,
    "location": "Parque"
  }
}
```

🔹 **Errores posibles:**
- `400`: "Se requiere especificar una ubicación válida"
- `400`: "Los parámetros de paginación deben ser números positivos"
- `404`: "No hay carreras disponibles en esta ubicación"
- `500`: "Error al obtener las carreras por ubicación"

---

## 🔹 **4. Filtrar Carreras por Deporte**

### **📌 GET /races/sport/:sport**

📌 **Descripción:** Obtiene las carreras filtradas por tipo de deporte con paginación.

🔹 **URL Completa:**
```
http://localhost:3000/api/races/sport/running
```

🔹 **Parámetros de ruta:**
- `sport`: Tipo de deporte (running, trailRunning, cycling)

🔹 **Parámetros de consulta opcionales:**
- `page`: Número de página (por defecto: 1)
- `limit`: Número de elementos por página (por defecto: 10)

🔹 **Ejemplo de Respuesta (200 - OK):**
```json
{
  "races": [
    {
      "_id": "67c5f0baa3b5234796ec17ee",
      "name": "Maratón de Primavera",
      "sport": "running",
      "date": "2025-05-15T09:00:00Z",
      "location": "Parque Central",
      "distance": 42.2,
      "maxParticipants": 500,
      "classification": [],
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
      "classification": [],
      "status": "open"
    }
  ],
  "pagination": {
    "totalRaces": 15,
    "totalPages": 2,
    "currentPage": 1,
    "limit": 10
  }
}
```

🔹 **Errores posibles:**
- `400`: "Tipo de deporte inválido. Opciones válidas: running, trailRunning, cycling"
- `400`: "Los parámetros de paginación deben ser números positivos"
- `404`: "No hay carreras disponibles para este deporte"
- `500`: "Error al obtener las carreras por deporte"

---

## 🔹 **5. Obtener Carrera por ID**

### **📌 GET /races/:id**

📌 **Descripción:** Obtiene los detalles completos de una carrera específica, incluyendo estadísticas de inscripciones.

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
  "classification": [],
  "createdBy": {
    "_id": "663f1b4667d0d8992e610c85",
    "name": "Admin Usuario",
    "email": "admin@example.com"
  },
  "status": "open",
  "createdAt": "2025-03-05T14:35:20.123Z",
  "registrationsCount": 120,
  "availableSlots": 380,
  "hasRunnersCSV": false,
  "runnersCSVPath": null,
  "lastCSVUpdate": null,
  "hasGPXFile": false,
  "gpxFilePath": null,
  "gpxFileUploadedAt": null,
  "gpxFileName": null
}
```

🔹 **Errores posibles:**
- `400`: "ID de carrera inválido"
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
  "qualifyingTime": "04:00:00",
  "classification": []
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
    "classification": [],
    "createdBy": "663f1b4667d0d8992e610c85",
    "status": "open",
    "createdAt": "2025-03-05T14:35:20.123Z"
  }
}
```

🔹 **Errores posibles:**
- `400`: "Todos los campos son requeridos"
- `400`: "Formato de fecha inválido"
- `400`: "Tipo de deporte inválido. Opciones válidas: running, trailRunning, cycling"
- `400`: "Los valores numéricos deben ser positivos"
- `400`: "Formato de tiempo de calificación inválido. Use HH:mm:ss"
- `400`: "Ya existe una carrera con el mismo nombre y fecha"
- `401`: "No hay token de autenticación" o "Token inválido"
- `403`: "No tienes permisos para crear carreras"
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
    "classification": [],
    "createdBy": "663f1b4667d0d8992e610c85",
    "status": "closed",
    "createdAt": "2025-03-05T14:35:20.123Z"
  }
}
```

🔹 **Errores posibles:**
- `400`: "ID de carrera inválido"
- `400`: "Tipo de deporte inválido. Opciones válidas: running, trailRunning, cycling"
- `400`: "El campo distance debe ser un número positivo" (y campos similares)
- `400`: "No se puede reducir el número máximo de participantes por debajo del número actual de inscripciones"
- `401`: "No hay token de autenticación" o "Token inválido"
- `403`: "No tienes permisos para actualizar carreras"
- `404`: "Carrera no encontrada"
- `500`: "Error al actualizar la carrera"

---

## 🔹 **8. Eliminar Carrera (Admin)**

### **📌 DELETE /races/:id**

📌 **Descripción:** Marca una carrera como eliminada y cancela sus inscripciones pendientes.

🔹 **URL Completa:**
```
http://localhost:3000/api/races/67c5f0baa3b5234796ec17ee
```

🔹 **Autenticación:**
Requiere cookie con token JWT de un usuario con rol "admin".

🔹 **Ejemplo de Respuesta (200 - OK):**
```json
{
  "message": "Carrera eliminada correctamente",
  "affectedRegistrations": 15
}
```

🔹 **Errores posibles:**
- `400`: "ID de carrera inválido"
- `400`: "Esta carrera ya ha sido eliminada"
- `401`: "No hay token de autenticación" o "Token inválido"
- `403`: "No tienes permisos para eliminar carreras"
- `404`: "Carrera no encontrada"
- `500`: "Error al eliminar la carrera"

---

## 🔹 **9. Registrar Resultados de Carrera (Admin)**

### **📌 POST /races/:id/results**

📌 **Descripción:** Registra los resultados de los participantes en una carrera y la marca como finalizada.

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
  "message": "Resultados registrados correctamente",
  "raceId": "67c5f0baa3b5234796ec17ee",
  "raceName": "Gran Maratón de Primavera",
  "totalResults": 3,
  "results": [
    {
      "userId": "663f1b4667d0d8992e610c86",
      "position": 1,
      "time": "03:45:22"
    },
    {
      "userId": "663f1b4667d0d8992e610c87",
      "position": 2,
      "time": "03:52:15"
    },
    {
      "userId": "663f1b4667d0d8992e610c88",
      "position": 3,
      "time": "04:01:33"
    }
  ]
}
```

🔹 **Errores posibles:**
- `400`: "ID de carrera inválido"
- `400`: "Se requiere un array de resultados válido"
- `400`: "Los siguientes usuarios no están inscritos en esta carrera: [lista de IDs]"
- `400`: "Formato de tiempo inválido para usuario [ID]: [tiempo] (debe ser HH:mm:ss)"
- `400`: "La posición para usuario [ID] debe ser un número entero positivo"
- `400`: "Hay posiciones duplicadas en los resultados"
- `400`: "No se pueden registrar resultados para una carrera eliminada"
- `401`: "No hay token de autenticación" o "Token inválido"
- `403`: "No tienes permisos para registrar resultados"
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
{
  "race": {
    "id": "67c5f0baa3b5234796ec17ee",
    "name": "Gran Maratón de Primavera",
    "date": "2025-05-15T09:00:00Z",
    "sport": "running",
    "distance": 42.2,
    "location": "Parque Central"
  },
  "results": [
    {
      "position": 1,
      "user": {
        "_id": "663f1b4667d0d8992e610c86",
        "name": "Juan Corredor",
        "email": "corredor@example.com",
        "age": 28
      },
      "time": "03:45:22",
      "registrationId": "67c5f1baa3b5234796ec17ff"
    },
    {
      "position": 2,
      "user": {
        "_id": "663f1b4667d0d8992e610c87",
        "name": "María Ciclista",
        "email": "ciclista@example.com",
        "age": 32
      },
      "time": "03:52:15",
      "registrationId": "67c5f1baa3b5234796ec1800"
    },
    {
      "position": 3,
      "user": {
        "_id": "663f1b4667d0d8992e610c88",
        "name": "Pedro Runner",
        "email": "runner@example.com",
        "age": 35
      },
      "time": "04:01:33",
      "registrationId": "67c5f1baa3b5234796ec1801"
    }
  ]
}
```

🔹 **Errores posibles:**
- `400`: "ID de carrera inválido"
- `404`: "Carrera no encontrada"
- `404`: "No se encontraron resultados para esta carrera"
- `500`: "Error al obtener los resultados de la carrera"

---

## 🔹 **11. Subir Archivo GPX de Carrera (Admin)**

### **📌 POST /races/:id/gpx**

📌 **Descripción:** Permite a un administrador subir un archivo GPX de la ruta para una carrera específica.

🔹 **URL Completa:**
```
http://localhost:3000/api/races/67c5f0baa3b5234796ec17ee/gpx
```

🔹 **Autenticación:**
Requiere cookie con token JWT de un usuario con rol "admin".

🔹 **Body (FormData):**
- `gpxFile`: Archivo GPX (máximo 20MB)
- `updateRaceInfo`: boolean (true/false) para actualizar automáticamente la información de la carrera basada en el GPX

🔹 **Ejemplo de Respuesta (200 - OK):**
```json
{
  "message": "Archivo GPX subido correctamente",
  "race": {
    "id": "67c5f0baa3b5234796ec17ee",
    "name": "Maratón de Primavera",
    "gpxFileName": "ruta_maraton_primavera.gpx",
    "gpxFileUploadedAt": "2025-03-10T11:20:15.456Z"
  },
  "gpxInfo": {
    "name": "Ruta Maratón de Primavera",
    "description": "Recorrido oficial",
    "totalDistance": 42.2,
    "elevationGain": 120,
    "elevationLoss": 120,
    "maxElevation": 150,
    "minElevation": 10,
    "totalElevation": 240,
    "isCircular": true,
    "numPoints": 1520,
    "estimatedDuration": "4h 15m",
    "startLocation": {
      "lat": 41.3851,
      "lon": 2.1734
    },
    "endLocation": {
      "lat": 41.3853,
      "lon": 2.1732
    }
  }
}
```

🔹 **Errores posibles:**
- `400`: "No se ha subido ningún archivo GPX"
- `400`: "ID de carrera inválido"
- `400`: "El archivo GPX no es válido o está corrupto"
- `401`: "No hay token de autenticación" o "Token inválido"
- `403`: "No tienes permisos para subir archivos GPX"
- `404`: "Carrera no encontrada"
- `500`: "Error al subir el archivo GPX"

---

## 🔹 **12. Descargar Archivo GPX de Carrera (Admin)**

### **📌 GET /races/:id/gpx**

📌 **Descripción:** Permite a un usuario autenticado descargar el archivo GPX de una carrera.

🔹 **URL Completa:**
```
http://localhost:3000/api/races/67c5f0baa3b5234796ec17ee/gpx
```

🔹 **Autenticación:**
Requiere cookie con token JWT de cualquier usuario autenticado.

🔹 **Respuesta:**
El archivo GPX se descarga directamente.

🔹 **Errores posibles:**
- `400`: "ID de carrera inválido"
- `401`: "No hay token de autenticación" o "Token inválido"
- `404`: "Carrera no encontrada"
- `404`: "Esta carrera no tiene archivo GPX disponible"
- `404`: "El archivo GPX no se encuentra disponible"
- `500`: "Error al descargar el archivo GPX"

---

## 🔹 **13. Eliminar Archivo GPX de Carrera (Admin)**

### **📌 DELETE /races/:id/gpx**

📌 **Descripción:** Permite a un administrador eliminar el archivo GPX de una carrera.

🔹 **URL Completa:**
```
http://localhost:3000/api/races/67c5f0baa3b5234796ec17ee/gpx
```

🔹 **Autenticación:**
Requiere cookie con token JWT de un usuario con rol "admin".

🔹 **Ejemplo de Respuesta (200 - OK):**
```json
{
  "message": "Archivo GPX eliminado correctamente",
  "raceId": "67c5f0baa3b5234796ec17ee"
}
```

🔹 **Errores posibles:**
- `400`: "ID de carrera inválido"
- `401`: "No hay token de autenticación" o "Token inválido"
- `403`: "No tienes permisos para eliminar archivos GPX"
- `404`: "Carrera no encontrada"
- `404`: "Esta carrera no tiene archivo GPX para eliminar"
- `500`: "Error al eliminar el archivo GPX"

---

## 🔹 **14. Subir Archivo CSV de Participantes (Admin)**

### **📌 POST /races/:id/runners-csv**

📌 **Descripción:** Permite a un administrador subir un archivo CSV con la lista de participantes.

�� **URL Completa:**
```
http://localhost:3000/api/races/67c5f0baa3b5234796ec17ee/runners-csv
```

🔹 **Autenticación:**
Requiere cookie con token JWT de un usuario con rol "admin".

🔹 **Body (FormData):**
- `csvFile`: Archivo CSV (máximo 20MB)

🔹 **Ejemplo de Respuesta (200 - OK):**
```json
{
  "message": "Archivo CSV subido correctamente",
  "race": {
    "id": "67c5f0baa3b5234796ec17ee",
    "name": "Maratón de Primavera",
    "csvFileName": "participantes_maraton_primavera.csv",
    "csvFileUploadedAt": "2025-03-10T11:20:15.456Z"
  }
}
```

�� **Errores posibles:**
- `400`: "No se ha subido ningún archivo CSV"
- `400`: "ID de carrera inválido"
- `400`: "El archivo CSV no es válido o está corrupto"
- `401`: "No hay token de autenticación" o "Token inválido"
- `403`: "No tienes permisos para subir archivos CSV"
- `404`: "Carrera no encontrada"
- `500`: "Error al subir el archivo CSV"

---

