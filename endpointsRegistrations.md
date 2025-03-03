# 📌 Documentación de Endpoints de Inscripciones

Esta documentación explica cómo probar los endpoints de `registrations` en **Thunder Client** (o Postman)

---

## 🔹 **1. Crear Inscripción**

### **📌 POST /registrations**

📌 **Descripción:** Inscribe a un usuario autenticado en una carrera.

🔹 **URL Completa:**
```
http://localhost:3000/api/registrations
```

🔹 **Autenticación:**
Requiere cookie con token JWT.

🔹 **Body (JSON):**
```json
{
  "race": "67c5f0baa3b5234796ec17ee"
}
```

🔹 **Ejemplo de Respuesta (201 - Creado):**
```json
{
  "message": "Inscripción realizada exitosamente",
  "registration": {
    "_id": "67c5f1baa3b5234796ec17ff",
    "race": {
      "_id": "67c5f0baa3b5234796ec17ee",
      "name": "Maratón de Primavera",
      "date": "2025-05-15T09:00:00Z",
      "location": "Parque Central",
      "sport": "running"
    },
    "user": "663f1b4667d0d8992e610c86",
    "registeredAt": "2025-03-10T08:30:15.421Z",
    "status": "registered"
  }
}
```

🔹 **Errores posibles:**
- `400`: "ID de carrera requerido"
- `400`: "Formato de ID de carrera inválido"
- `400`: "Ya estás inscrito en esta carrera"
- `401`: "No hay token de autenticación" o "Token inválido"
- `404`: "Carrera no encontrada"
- `409`: "La carrera está completa (sin plazas disponibles)"
- `409`: "La carrera no está abierta para inscripciones"
- `500`: "Error al crear la inscripción"

---

## 🔹 **2. Obtener Inscripciones del Usuario Autenticado**

### **📌 GET /registrations/user**

📌 **Descripción:** Obtiene todas las inscripciones del usuario que está autenticado.

🔹 **URL Completa:**
```
http://localhost:3000/api/registrations/user
```

🔹 **Autenticación:**
Requiere cookie con token JWT.

🔹 **Ejemplo de Respuesta (200 - OK):**
```json
[
  {
    "_id": "67c5f1baa3b5234796ec17ff",
    "race": {
      "_id": "67c5f0baa3b5234796ec17ee",
      "name": "Maratón de Primavera",
      "date": "2025-05-15T09:00:00Z",
      "sport": "running",
      "location": "Parque Central",
      "distance": 42.2
    },
    "registeredAt": "2025-03-10T08:30:15.421Z",
    "status": "registered"
  },
  {
    "_id": "67c5f1baa3b5234796ec1800",
    "race": {
      "_id": "67c5f0baa3b5234796ec17ef",
      "name": "Vuelta Ciclista",
      "date": "2025-06-20T08:30:00Z",
      "sport": "cycling",
      "location": "Montaña Alta",
      "distance": 120.5
    },
    "registeredAt": "2025-03-15T10:45:20.789Z",
    "status": "registered"
  }
]
```

🔹 **Parámetros de consulta opcionales:**
- `status`: Filtrar por estado ("registered", "cancelled", "finished")

🔹 **Errores posibles:**
- `401`: "No hay token de autenticación" o "Token inválido"
- `500`: "Error al obtener las inscripciones"

---

## 🔹 **3. Obtener Inscripciones de un Usuario Específico (Admin)**

### **📌 GET /registrations/user/:userId**

📌 **Descripción:** Permite a un administrador obtener las inscripciones de cualquier usuario por su ID.

🔹 **URL Completa:**
```
http://localhost:3000/api/registrations/user/663f1b4667d0d8992e610c86
```

🔹 **Autenticación:**
Requiere cookie con token JWT de un usuario con rol "admin".

🔹 **Ejemplo de Respuesta (200 - OK):**
```json
[
  {
    "_id": "67c5f1baa3b5234796ec17ff",
    "race": {
      "_id": "67c5f0baa3b5234796ec17ee",
      "name": "Maratón de Primavera",
      "date": "2025-05-15T09:00:00Z",
      "sport": "running"
    },
    "user": {
      "_id": "663f1b4667d0d8992e610c86",
      "name": "Juan Corredor",
      "email": "corredor@example.com"
    },
    "registeredAt": "2025-03-10T08:30:15.421Z",
    "status": "registered"
  }
]
```

🔹 **Errores posibles:**
- `401`: "No hay token de autenticación" o "Token inválido"
- `403`: "No tienes permisos para acceder a este recurso"
- `404`: "Usuario no encontrado"
- `500`: "Error al obtener las inscripciones"

---

## 🔹 **4. Obtener Todas las Inscripciones (Admin)**

### **📌 GET /registrations**

📌 **Descripción:** Permite a un administrador obtener todas las inscripciones del sistema.

🔹 **URL Completa:**
```
http://localhost:3000/api/registrations
```

🔹 **Autenticación:**
Requiere cookie con token JWT de un usuario con rol "admin".

🔹 **Parámetros de consulta opcionales:**
- `status`: Filtrar por estado ("registered", "cancelled", "finished")
- `race`: Filtrar por ID de carrera
- `page`: Número de página para paginación
- `limit`: Número de elementos por página

🔹 **Ejemplo de Respuesta (200 - OK):**
```json
{
  "totalRegistrations": 45,
  "totalPages": 3,
  "currentPage": 1,
  "registrations": [
    {
      "_id": "67c5f1baa3b5234796ec17ff",
      "race": {
        "_id": "67c5f0baa3b5234796ec17ee",
        "name": "Maratón de Primavera"
      },
      "user": {
        "_id": "663f1b4667d0d8992e610c86",
        "name": "Juan Corredor",
        "email": "corredor@example.com"
      },
      "registeredAt": "2025-03-10T08:30:15.421Z",
      "status": "registered"
    },
    {
      "_id": "67c5f1baa3b5234796ec1800",
      "race": {
        "_id": "67c5f0baa3b5234796ec17ef",
        "name": "Vuelta Ciclista"
      },
      "user": {
        "_id": "663f1b4667d0d8992e610c87",
        "name": "María Ciclista",
        "email": "ciclista@example.com"
      },
      "registeredAt": "2025-03-15T10:45:20.789Z",
      "status": "registered"
    }
    // ... más inscripciones
  ]
}
```

🔹 **Errores posibles:**
- `401`: "No hay token de autenticación" o "Token inválido"
- `403`: "No tienes permisos para acceder a este recurso"
- `500`: "Error al obtener las inscripciones"

---

## 🔹 **5. Obtener Inscripciones por Carrera (Admin)**

### **📌 GET /registrations/race/:raceId**

📌 **Descripción:** Permite a un administrador obtener todas las inscripciones para una carrera específica.

🔹 **URL Completa:**
```
http://localhost:3000/api/registrations/race/67c5f0baa3b5234796ec17ee
```

🔹 **Autenticación:**
Requiere cookie con token JWT de un usuario con rol "admin".

🔹 **Parámetros de consulta opcionales:**
- `status`: Filtrar por estado ("registered", "cancelled", "finished")

🔹 **Ejemplo de Respuesta (200 - OK):**
```json
[
  {
    "_id": "67c5f1baa3b5234796ec17ff",
    "race": {
      "_id": "67c5f0baa3b5234796ec17ee",
      "name": "Maratón de Primavera",
      "sport": "running"
    },
    "user": {
      "_id": "663f1b4667d0d8992e610c86",
      "name": "Juan Corredor",
      "email": "corredor@example.com"
    },
    "registeredAt": "2025-03-10T08:30:15.421Z",
    "status": "registered"
  },
  {
    "_id": "67c5f1baa3b5234796ec18aa",
    "race": {
      "_id": "67c5f0baa3b5234796ec17ee",
      "name": "Maratón de Primavera",
      "sport": "running"
    },
    "user": {
      "_id": "663f1b4667d0d8992e610c87",
      "name": "María Ciclista",
      "email": "ciclista@example.com"
    },
    "registeredAt": "2025-03-12T10:15:30.789Z",
    "status": "registered"
  }
]
```

🔹 **Errores posibles:**
- `401`: "No hay token de autenticación" o "Token inválido"
- `403`: "No tienes permisos para acceder a este recurso"
- `404`: "Carrera no encontrada"
- `500`: "Error al obtener las inscripciones"

---

## 🔹 **6. Registrar Tiempo en Inscripción (Admin)**

### **📌 PUT /registrations/:id/time**

📌 **Descripción:** Permite a un administrador registrar el tiempo y posición de un participante.

🔹 **URL Completa:**
```
http://localhost:3000/api/registrations/67c5f1baa3b5234796ec17ff/time
```

🔹 **Autenticación:**
Requiere cookie con token JWT de un usuario con rol "admin".

🔹 **Body (JSON):**
```json
{
  "time": "03:45:22",
  "position": 12
}
```

🔹 **Ejemplo de Respuesta (200 - OK):**
```json
{
  "message": "Resultados registrados exitosamente",
  "registration": {
    "_id": "67c5f1baa3b5234796ec17ff",
    "race": "67c5f0baa3b5234796ec17ee",
    "user": "663f1b4667d0d8992e610c86",
    "registeredAt": "2025-03-10T08:30:15.421Z",
    "status": "finished",
    "time": "2025-05-15T03:45:22.000Z",
    "position": 12
  }
}
```

🔹 **Errores posibles:**
- `400`: "Datos de resultados inválidos"
- `401`: "No hay token de autenticación" o "Token inválido"
- `403`: "No tienes permisos para acceder a este recurso"
- `404`: "Inscripción no encontrada"
- `409`: "La carrera no está en estado 'finished'"
- `500`: "Error al actualizar la inscripción"

---

## 🔹 **7. Cancelar Inscripción**

### **📌 PUT /registrations/:id/cancel**

📌 **Descripción:** Permite a un usuario cancelar su propia inscripción en una carrera.

🔹 **URL Completa:**
```
http://localhost:3000/api/registrations/67c5f1baa3b5234796ec17ff/cancel
```

🔹 **Autenticación:**
Requiere cookie con token JWT.

🔹 **Ejemplo de Respuesta (200 - OK):**
```json
{
  "message": "Inscripción cancelada exitosamente",
  "registration": {
    "_id": "67c5f1baa3b5234796ec17ff",
    "race": {
      "_id": "67c5f0baa3b5234796ec17ee",
      "name": "Maratón de Primavera"
    },
    "user": "663f1b4667d0d8992e610c86",
    "registeredAt": "2025-03-10T08:30:15.421Z",
    "status": "cancelled"
  }
}
```

🔹 **Errores posibles:**
- `401`: "No hay token de autenticación" o "Token inválido"
- `403`: "No puedes cancelar una inscripción que no te pertenece"
- `404`: "Inscripción no encontrada"
- `409`: "No se puede cancelar una inscripción ya finalizada"
- `409`: "No se puede cancelar una inscripción cuando la carrera ya pasó"
- `500`: "Error al cancelar la inscripción"

---