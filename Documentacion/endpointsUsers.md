# 📌 Documentación de Endpoints de Users

Esta documentación explica cómo probar los endpoints de `users` en **Thunder Client** (o Postman)

---

## 🔹 **Registro de Usuario**

### **📌 POST /users/register**

📌 **Descripción:** Registra un nuevo usuario en el sistema.

🔹 **URL Completa:**

```
http://localhost:3000/api/users/register
```

🔹 **Body (JSON):**

```json
{
  "email": "usuario@example.com",
  "password": "123456",
  "name": "Juan Pérez",
  "gender": "male",
  "age": 30
}
```

🔹 **Ejemplo de Respuesta (201 - Usuario creado):**

```json
{
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": "67c5efbaa3b5234796ec17dd",
    "name": "Usuario prueba",
    "email": "usuario@example.com",
    "role": "user",
    "age": 30,
    "registrationDate": "2025-03-03T18:06:50.652Z",
    "avatar": "default.jpg"
  }
}
```

🔹 **Errores posibles:**

- `400`: "El usuario ya existe"
- `500`: "Error interno del servidor"

---

## 🔹 **Inicio de Sesión**

### **📌 POST /users/login**

📌 **Descripción:** Inicia sesión, establece una cookie con el token JWT y devuelve información del usuario.

🔹 **URL Completa:**

```
http://localhost:3000/api/users/login
```

🔹 **Body (JSON):**

```json
{
  "email": "usuario@example.com",
  "password": "123456"
}
```

🔹 **Ejemplo de Respuesta (200 - Inicio de sesión exitoso):**

```json
{
  "message": "Inicio de sesión correcto",
  "user": {
    "id": "663f1b4667d0d8992e610c85",
    "email": "usuario@example.com",
    "name": "Juan Pérez",
    "role": "user",
    "avatar": "default.jpg",
    "age": 30
  }
}
```

### No es necesario manipular el token manualmente. Las peticiones a endpoints protegidos se autenticarán automáticamente mediante la cookie si estás usando un navegador o un cliente HTTP que soporte cookies (con withCredentials: true).

🔹 **Errores posibles:**

- `400`: "Usuario o contraseña incorrectos"
- `500`: "Error interno del servidor"

---
## 🔹 **Cerrar Sesión**

### **📌 POST /users/logout**

📌 **Descripción:** Cierra la sesión del usuario actual eliminando la cookie con el token JWT.

🔹 **URL Completa:**

```
http://localhost:3000/api/users/logout
```

🔹 **Ejemplo de Respuesta (200 - Sesión cerrada):**

```json
{
  "message": "Cierre de sesión exitoso"
}
```

🔹 **Errores posibles:**

- `500`: "Error al cerrar sesión"

---

## 🔹 **Obtener Perfil del Usuario**

### **📌 GET /users/profile**

📌 **Descripción:** Obtiene el perfil del usuario autenticado (el actual que ha iniciado sesión).

🔹 **URL Completa:**

```
http://localhost:3000/api/users/profile
```


🔹 **Ejemplo de Respuesta (200 - Perfil del usuario):**

```json
{
  "id": "663f1b4667d0d8992e610c85",
  "email": "usuario@example.com",
  "name": "Juan Pérez",
  "role": "user",
  "avatar": "default.jpg",
  "age": 30,
  "registrationDate": "2023-03-01T14:30:00Z"
}
```

🔹 **Errores posibles:**

- `401`: "No autorizado"
- `500`: "Error interno del servidor"

---

## 🔹 **Actualizar Perfil**

### **📌 PUT /users/profile**

📌 **Descripción:** Actualiza la información del perfil del usuario autenticado.

🔹 **URL Completa:**

```
http://localhost:3000/api/users/profile
```

🔹 **Body (JSON):**

```json
{
  "name": "Nuevo Nombre",
  "age": 35,
  "avatar": "avatar-nuevo.jpg"
}
```

🔹 **Ejemplo de Respuesta (200 - Perfil actualizado):**

```json
{
  "message": "Perfil actualizado con éxito",
  "user": {
    "_id": "67c5efbaa3b5234796ec17dd",
    "email": "usuario@example.com",
    "name": "Usuario actualizado2",
    "role": "user",
    "avatar": "avatar-nuevo2.jpg",
    "age": 35,
    "registrationDate": "2025-03-03T18:06:50.652Z",
    "__v": 0
  }
}
```

🔹 **Errores posibles:**

- `400`: "Datos inválidos"
- `401`: "No autorizado"
- `500`: "Error interno del servidor"

---
## 🔹 **Descargar Archivo GPX de Carrera**

### **📌 GET /users/:id/gpx**

📌 **Descripción:** Permite a un usuario normal descargar el archivo GPX de una carrera.

🔹 **URL Completa:**
```
http://localhost:3000/api/users/67c5f0baa3b5234796ec17ee/gpx
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