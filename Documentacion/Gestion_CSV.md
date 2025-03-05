# 📄 Gestión de CSV para Resultados de Carreras

## Lo que se pide
- Descargar un CSV con los participantes inscritos (incluyendo sus dorsales).
- Completar tiempos y subir el CSV para actualizar los resultados automáticamente.
- Mantener la opción manual existente.

## Actualización del Modelo de Inscripción (Registration)
- Se agrega un campo al esquema `Registration`:
  - `dorsal: { type: Number, default: null }`

## Actualización del Modelo de Carrera
- Se agregan campos al esquema `Race` para el seguimiento de archivos CSV:
  - `hasRunnersCSV: Boolean`
  - `runnersCSVPath: String`
  - `lastCSVUpdate: Date`

## Configuración para manejo de archivos
### Instalación de Multer
```sh
npm install multer
```
### Configuración de almacenamiento de CSV
- Se usa `multer.diskStorage` para guardar archivos en `uploads/csv`.
- Se validan los archivos asegurando que sean `.csv`.

## Actualización de Rutas API
- **GET** `/api/races/:id/runners-csv` (Descargar CSV de participantes con dorsales).
- **POST** `/api/races/:id/results-csv` (Subir CSV con resultados).

## Implementación de Controladores

### Descargar CSV de participantes
- Solo accesible para el creador de la carrera o admin.
- Genera un CSV con los datos de las inscripciones existentes.
- Incluye email, nombre, dorsal asignado y columna de tiempo vacía.

### Subir CSV con resultados
- Se valida el formato de tiempo (`HH:mm:ss`).
- Se verifica que los corredores existen, están inscritos y sus dorsales coinciden.
- Se actualizan los tiempos y posiciones en la base de datos (tabla Registration).
- Se marca la carrera como finalizada.
- Opcionalmente se envían emails con los resultados a los participantes.

## Instalación de PapaParse para manejo de CSV
```sh
npm install papaparse
```

## 💡 Estructura de Archivos CSV

### CSV generado con participantes
```csv
email,nombre,dorsal,tiempo
corredor1@example.com,José Corredor,101,
corredor2@example.com,María Runner,102,
```

### CSV con resultados completados
```csv
email,dorsal,tiempo
corredor1@example.com,101,01:45:22
corredor2@example.com,102,01:52:15
```

---

# Guía Paso a Paso para Probar con Postman

## Preparación Inicial


### Asignar Dorsales Manualmente

Antes de comenzar, asegúrate de que hay inscripciones en la carrera y que tienen dorsales asignados. Puedes hacer esto manualmente a través de MongoDB o mediante la API.

### Verificar Directorios
Asegúrate de que exista el directorio `uploads/csv` en la carpeta del backend:
```bash
mkdir -p Backend/uploads/csv
chmod -R 777 Backend/uploads
```

## Prueba con Postman

### Paso 1: Login para Obtener Token

1. Abre Postman
2. Crea una nueva solicitud POST a `http://localhost:3000/api/users/login`
3. En la pestaña "Body" selecciona formato "JSON"
4. Ingresa las credenciales:
   ```json
   {
     "email": "admin@example.com",
     "password": "123456"
   }
   ```
5. Haz clic en "Send"
6. Verifica que recibes un Status 200 OK
7. Postman automáticamente guardará las cookies con el token JWT

### Paso 2: Descargar CSV de Participantes

1. Crea una nueva solicitud GET a `http://localhost:3000/api/races/{ID_DE_LA_CARRERA}/runners-csv`
   - Reemplaza `{ID_DE_LA_CARRERA}` con un ID válido, por ejemplo: `663f1b4667d0d8992e610d85`
2. Asegúrate de que Postman está usando las cookies de la sesión anterior
3. Haz clic en "Send"
4. Verifica que recibes un archivo CSV para descargar
5. Guarda el archivo como `resultados.csv`
6. Abre el archivo y verifica que contiene:
   - Email de cada participante
   - Nombre del participante
   - Dorsal asignado
   - Columna `tiempo` en blanco

### Paso 3: Completar y Subir CSV con Resultados

1. Edita el archivo `resultados.csv` descargado y completa la columna `tiempo` con valores como:
   ```csv
   email,nombre,dorsal,tiempo
   admin@example.com,Admin Usuario,101,01:45:22
   corredor@example.com,Juan Corredor,102,01:52:15
   ciclista@example.com,María Ciclista,103,02:01:33
   ```
2. Crea una nueva solicitud POST a `http://localhost:3000/api/races/{ID_DE_LA_CARRERA}/results-csv`
   - Usa el mismo ID de carrera que antes
3. En la pestaña "Body" selecciona "form-data"
4. Añade un campo llamado "file" de tipo "File"
5. Haz clic en "Select Files" y selecciona tu archivo `resultados.csv` actualizado
6. Haz clic en "Send"
7. Verifica que recibes un Status 200 OK con un mensaje similar a:
   ```json
   {
     "message": "Resultados procesados correctamente",
     "raceId": "663f1b4667d0d8992e610d85",
     "raceName": "Maratón Urbano 2023",
     "totalResults": 3,
     "emailsScheduled": true
   }
   ```

### Paso 4: Verificar Resultados en la Base de Datos

1. Crea una nueva solicitud GET a `http://localhost:3000/api/races/{ID_DE_LA_CARRERA}/results`
   - Usa el mismo ID de carrera
2. Haz clic en "Send"
3. Verifica que recibes los resultados procesados correctamente, incluyendo los dorsales y tiempos

## 🔍 Solución de Problemas Comunes

### Error: "No token de autenticación"
- Asegúrate de que la cookie de sesión se está enviando correctamente
- Intenta hacer login nuevamente
- Verifica que el token no haya expirado

### Error: "No tienes permisos para descargar datos de esta carrera"
- Asegúrate de estar usando un usuario admin o el creador de la carrera
- Verifica que el ID de la carrera es correcto

### Error: "No hay inscripciones registradas para esta carrera"
- Verifica que existen inscripciones en la carrera seleccionada

### Error: "El usuario X no está inscrito en esta carrera"
- Comprueba que los emails en el CSV corresponden a usuarios inscritos

### Error: "El dorsal X no coincide con el asignado al usuario Y"
- Asegúrate de que los dorsales en el CSV coinciden con los asignados en la base de datos

### Error al escribir archivos
- Verifica que el directorio `uploads/csv` existe y tiene permisos de escritura
- Si usas Docker, asegúrate de que el volumen está correctamente configurado

