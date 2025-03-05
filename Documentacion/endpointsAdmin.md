# 📌 Documentación de Endpoints de Admin

Esta documentación explica cómo probar los endpoints de `admin` en **Thunder Client** (o Postman)

---

## 🔹 **1. Obtener Todos los Usuarios**

### **📌 GET /admin/users**

📌 **Descripción:** Obtiene la lista de todos los usuarios registrados en el sistema.

🔹 **URL Completa:**
```
http://localhost:3000/api/admin/users
```

🔹 **Autenticación:**
Requiere cookie con token JWT de un usuario con rol "admin".

🔹 **Ejemplo de Respuesta (200 - OK):**
```json
[
  {
    "_id": "67c5efbaa3b5234796ec17dd",
    "email": "usuario1@example.com",
    "name": "Usuario Uno",
    "role": "user",
    "avatar": "default.jpg",
    "age": 28,
    "registrationDate": "2025-03-01T10:15:30.652Z",
    "__v": 0
  },
  {
    "_id": "67c5efbaa3b5234796ec17de",
    "email": "usuario2@example.com",
    "name": "Usuario Dos",
    "role": "admin",
    "avatar": "default.jpg",
    "age": 35,
    "registrationDate": "2025-03-02T14:25:10.123Z",
    "__v": 0
  }
]
```

🔹 **Errores posibles:**
- `401`: "No hay token de autenticación" o "Token inválido"
- `403`: "No tienes permisos para acceder a este recurso"
- `500`: "Error al obtener todos los usuarios"

---

## 🔹 **2. Obtener Usuario por ID**

### **📌 GET /admin/users/:id**

📌 **Descripción:** Obtiene la información de un usuario específico mediante su ID.

🔹 **URL Completa:**
```
http://localhost:3000/api/admin/users/67c5efbaa3b5234796ec17dd
```

🔹 **Autenticación:**
Requiere cookie con token JWT de un usuario con rol "admin".

🔹 **Ejemplo de Respuesta (200 - OK):**
```json
{
  "_id": "67c5efbaa3b5234796ec17dd",
  "email": "usuario1@example.com",
  "name": "Usuario Uno",
  "role": "user",
  "avatar": "default.jpg",
  "age": 28,
  "registrationDate": "2025-03-01T10:15:30.652Z",
  "__v": 0
}
```

🔹 **Errores posibles:**
- `401`: "No hay token de autenticación" o "Token inválido"
- `403`: "No tienes permisos para acceder a este recurso"
- `404`: "Usuario no encontrado"
- `500`: "Error al obtener el usuario"

---

## 🔹 **3. Buscar Usuarios por Nombre**

### **📌 GET /admin/users/search**

📌 **Descripción:** Busca usuarios que coincidan con el nombre proporcionado.

🔹 **URL Completa:**
```
http://localhost:3000/api/admin/users/search?name=Usuario
```

🔹 **Parámetros de consulta:**
- `name`: Texto para buscar en los nombres de usuario (obligatorio)

🔹 **Autenticación:**
Requiere cookie con token JWT de un usuario con rol "admin".

🔹 **Ejemplo de Respuesta (200 - OK):**
```json
[
  {
    "_id": "67c5efbaa3b5234796ec17dd",
    "email": "usuario1@example.com",
    "name": "Usuario Uno",
    "role": "user",
    "avatar": "default.jpg",
    "age": 28,
    "registrationDate": "2025-03-01T10:15:30.652Z",
    "__v": 0
  },
  {
    "_id": "67c5efbaa3b5234796ec17de",
    "email": "usuario2@example.com",
    "name": "Usuario Dos",
    "role": "admin",
    "avatar": "default.jpg",
    "age": 35,
    "registrationDate": "2025-03-02T14:25:10.123Z",
    "__v": 0
  }
]
```

🔹 **Errores posibles:**
- `400`: "Se requiere un nombre para la búsqueda"
- `401`: "No hay token de autenticación" o "Token inválido"
- `403`: "No tienes permisos para acceder a este recurso"
- `500`: "Error al obtener usuarios"

---

## 🔹 **4. Actualizar Usuario**

### **📌 PUT /admin/users/:id**

📌 **Descripción:** Actualiza la información de un usuario específico (como administrador).

🔹 **URL Completa:**
```
http://localhost:3000/api/admin/users/67c5efbaa3b5234796ec17dd
```

🔹 **Body (JSON):**
```json
{
  "name": "Nombre Actualizado",
  "email": "nuevoemail@example.com",
  "role": "admin",
  "age": 32,
  "avatar": "nuevo-avatar.jpg"
}
```

🔹 **Autenticación:**
Requiere cookie con token JWT de un usuario con rol "admin".

🔹 **Ejemplo de Respuesta (200 - OK):**
```json
{
  "_id": "67c5efbaa3b5234796ec17dd",
  "email": "nuevoemail@example.com",
  "name": "Nombre Actualizado",
  "role": "admin",
  "avatar": "nuevo-avatar.jpg",
  "age": 32,
  "registrationDate": "2025-03-01T10:15:30.652Z",
  "__v": 0
}
```

🔹 **Errores posibles:**
- `400`: "El email ya está en uso"
- `401`: "No hay token de autenticación" o "Token inválido"
- `403`: "No tienes permisos para acceder a este recurso"
- `404`: "Usuario no encontrado"
- `500`: "Error al actualizar el usuario"

---

## 🔹 **5. Eliminar Usuario**

### **📌 DELETE /admin/users/:id**

📌 **Descripción:** Elimina un usuario específico del sistema.

🔹 **URL Completa:**
```
http://localhost:3000/api/admin/users/67c5efbaa3b5234796ec17dd
```

🔹 **Autenticación:**
Requiere cookie con token JWT de un usuario con rol "admin".

🔹 **Ejemplo de Respuesta (200 - OK):**
```json
{
  "message": "Usuario eliminado exitosamente"
}
```

🔹 **Errores posibles:**
- `401`: "No hay token de autenticación" o "Token inválido"
- `403`: "No tienes permisos para acceder a este recurso"
- `404`: "Usuario no encontrado"
- `500`: "Error al eliminar el usuario"

---

## 🔹 **6. Cambiar Rol de Usuario**

### **📌 POST /admin/users/change-role**

📌 **Descripción:** Cambia el rol de un usuario entre "user" y "admin".

🔹 **URL Completa:**
```
http://localhost:3000/api/admin/users/change-role
```

🔹 **Body (JSON):**
```json
{
  "userId": "67c5efbaa3b5234796ec17dd",
  "role": "admin"
}
```

🔹 **Autenticación:**
Requiere cookie con token JWT de un usuario con rol "admin".

🔹 **Ejemplo de Respuesta (200 - OK):**
```json
{
  "message": "Rol actualizado correctamente",
  "user": {
    "_id": "67c5efbaa3b5234796ec17dd",
    "email": "usuario1@example.com",
    "name": "Usuario Uno",
    "role": "admin",
    "avatar": "default.jpg",
    "age": 28,
    "registrationDate": "2025-03-01T10:15:30.652Z",
    "__v": 0
  }
}
```

🔹 **Errores posibles:**
- `400`: "Rol inválido"
- `401`: "No hay token de autenticación" o "Token inválido"
- `403`: "No tienes permisos para acceder a este recurso"
- `404`: "Usuario no encontrado"
- `500`: "Error al cambiar el rol del usuario"

---

## 🔹 **7. Obtener Estadísticas del Sistema**

### **📌 GET /admin/stats**

📌 **Descripción:** Obtiene métricas y estadísticas generales del sistema.

🔹 **URL Completa:**
```
http://localhost:3000/api/admin/stats
```

🔹 **Autenticación:**
Requiere cookie con token JWT de un usuario con rol "admin".

🔹 **Ejemplo de Respuesta (200 - OK):**
```json
{
  "users": {
    "total": 156,
    "admins": 5,
    "regularUsers": 151,
    "newThisMonth": 23
  },
  "races": {
    "total": 42,
    "byStatus": {
      "open": 15,
      "closed": 5,
      "finished": 20,
      "deleted": 2
    },
    "bySport": {
      "running": 20,
      "trailRunning": 12,
      "cycling": 10
    },
    "upcoming": 18
  },
  "registrations": {
    "total": 875,
    "byStatus": {
      "registered": 350,
      "cancelled": 125,
      "finished": 400
    },
    "thisMonth": 145
  }
}
```

🔹 **Errores posibles:**
- `401`: "No hay token de autenticación" o "Token inválido"
- `403`: "No tienes permisos para acceder a este recurso"
- `500`: "Error al obtener las estadísticas del sistema"

---