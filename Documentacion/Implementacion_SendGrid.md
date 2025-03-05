# 📧 Implementación de Emails de Resultados con SendGrid

Esta documentación detalla cómo se ha implementado el sistema de notificación por email para informar a los participantes sobre sus resultados en las carreras deportivas, utilizando SendGrid como servicio de envío de correos electrónicos.

## 📋 Índice

1. [Configuración Inicial](#1-configuración-inicial)
2. [Estructura de los Archivos](#2-estructura-de-los-archivos)
3. [Función Principal de Envío de Emails](#3-función-principal-de-envío-de-emails)
4. [Integración en el Registro Manual de Resultados](#4-integración-en-el-registro-manual-de-resultados)
5. [Integración en el Registro por CSV](#5-integración-en-el-registro-por-csv)
6. [Flujo de Datos](#6-flujo-de-datos)
7. [Gestión de Errores](#7-gestión-de-errores)
8. [Configuración para Entornos de Desarrollo y Producción](#8-configuración-para-entornos-de-desarrollo-y-producción)
9. [Guía de Pruebas](#9-guía-de-pruebas)
10. [Solución de Problemas Comunes](#10-solución-de-problemas-comunes)

---

## 1. Configuración Inicial

### 1.1 Instalación del Paquete de SendGrid

Para utilizar SendGrid, primero se instaló el paquete oficial:

```bash
npm install @sendgrid/mail
```

### 1.2 Configuración de Variables de Entorno

Se agregaron las siguientes variables de entorno al archivo `.env`:

```
SENDGRID_API_KEY=tu_api_key_de_sendgrid
SENDGRID_FROM_EMAIL=correo_verificado@dominio.com
```

Es esencial que `SENDGRID_FROM_EMAIL` sea un email verificado en SendGrid para evitar problemas de entrega.

### 1.3 Verificación del Dominio/Email en SendGrid

Antes de usar SendGrid en producción, se completó el proceso de verificación de dominio o email en la plataforma de SendGrid para mejorar la entregabilidad de los correos.

---

## 2. Estructura de los Archivos

### 2.1 Archivo de Configuración de Email (`config/email.js`)

Se creó un archivo dedicado para la configuración y funciones relacionadas con el envío de emails



### 2.2 Actualización del Controlador (`controllers/raceController.js`)

Se añadió la importación de la función de envío de email al controlador de carreras:

```javascript
// En la parte superior del archivo
import { sendRaceResultsEmail } from '../config/email.js';
import User from "../models/User.js";
```

---

## 3. Función Principal de Envío de Emails

La función `sendRaceResultsEmail` es el núcleo de la implementación. Esta función:

1. **Recibe parámetros clave**:
   - `user`: Objeto completo del usuario (contiene email, nombre, etc.)
   - `race`: Objeto completo de la carrera (nombre, fecha, ubicación, etc.)
   - `results`: Objeto con los resultados específicos del usuario (tiempo, posición)

2. **Formatea los datos**:
   - Formatea el tiempo y la posición para su presentación
   - Prepara el texto plano y versión HTML del email

3. **Configura el mensaje**:
   - Destino: Email del usuario (`user.email`)
   - Remitente: Email verificado en SendGrid (desde .env)
   - Asunto: Incluye el nombre de la carrera
   - Contenido: Versiones texto plano y HTML con los resultados

4. **Envía el email**:
   - Utiliza `sgMail.send()` para enviar el mensaje
   - Registra el éxito o fracaso en la consola
   - Retorna `true` si el envío fue exitoso, `false` en caso contrario

5. **Maneja errores**:
   - Captura cualquier error durante el envío
   - Registra detalles del error en la consola
   - Retorna `false` para indicar que el envío falló

---

## 4. Integración en el Registro Manual de Resultados

La función `registerRaceResults` en `raceController.js` permite registrar resultados manualmente para una carrera. Se ha integrado el envío de emails en esta función


### Puntos clave de esta implementación:

1. **Procesamiento en segundo plano**: La función `sendEmails` se ejecuta de manera asíncrona sin bloquear la respuesta de la API.

2. **Obtención de datos completos del usuario**: Se busca el usuario completo en la base de datos usando su ID para obtener el email y otros datos.

3. **Registro de resultados**: Se mantiene un contador de emails enviados exitosamente y fallidos.

4. **Manejo de errores por usuario**: Si falla el envío a un usuario, no afecta a los demás.

---

## 5. Integración en el Registro por CSV

La función `uploadResultsCSV` en `raceController.js` permite registrar resultados mediante la carga de un archivo CSV. También se ha integrado el envío de emails


### Similitudes y diferencias con el registro manual:

- **Misma estructura básica**: Se usa la misma función `sendRaceResultsEmail` y se procesa en segundo plano.
- **Origen de los datos**: En este caso, los `results` provienen del procesamiento del CSV subido.
- **Actualización en base de datos**: Primero se actualizan los registros en la base de datos y luego se envían los emails.
- **Retroalimentación al cliente**: Se informa en la respuesta que se programaron los emails con `emailsScheduled: true`.

---

## 6. Flujo de Datos

El flujo completo de datos para el envío de emails es el siguiente:

### 6.1 Para registro manual de resultados:

1. **Recepción de datos**:
   - El administrador envía un array de resultados a través de la API
   - Cada resultado contiene `userId`, `time`, y `position`

2. **Procesamiento**:
   - Se validan los datos recibidos
   - Se actualizan las inscripciones en la base de datos
   - Se marca la carrera como finalizada

3. **Preparación de emails**:
   - Para cada resultado, se busca el usuario completo en la base de datos
   - Se obtiene información completa de la carrera
   - Se combina la información para construir el email personalizado

4. **Envío de emails**:
   - Se llama a `sendRaceResultsEmail` para cada participante
   - Los emails se envían a través de SendGrid
   - Se registra el éxito o fracaso de cada envío

### 6.2 Para registro por CSV:

1. **Procesamiento del CSV**:
   - Se valida el formato del archivo CSV
   - Se extraen los datos (email, dorsal, tiempo)
   - Se buscan los usuarios correspondientes en la base de datos por email
   - Se verifican las inscripciones existentes

2. **Actualización de la base de datos**:
   - Se actualizan las inscripciones con los tiempos y posiciones
   - Se marca la carrera como finalizada

3. **Envío de emails**:
   - Para cada resultado procesado, se busca el usuario completo en la base de datos
   - Se llama a `sendRaceResultsEmail` para cada participante
   - Se registra el éxito o fracaso de cada envío

---

## 7. Gestión de Errores

La implementación incluye una gestión de errores:

### 7.1 Errores en la función de envío:

```javascript
export const sendRaceResultsEmail = async (user, race, results) => {
  try {
    // Configuración y envío...
    return true;
  } catch (error) {
    console.error("Error al enviar email:", error);
    return false;  // Indica que el envío falló
  }
};
```

- Captura cualquier error durante la configuración o envío del email
- Registra el error en la consola para diagnóstico
- Retorna `false` para indicar el fallo al código que lo llamó

### 7.2 Errores en el procesamiento por usuario:

```javascript
for (let result of results) {
  try {
    const user = await User.findById(result.userId);
    // Procesamiento y envío...
  } catch (emailError) {
    console.error(`Error al procesar email para usuario ${result.userId}:`, emailError);
    errorCount++;
  }
}
```

- Cada usuario se procesa en un bloque try/catch separado
- Si falla un usuario, no afecta al procesamiento de los demás
- Se registra el error específico para ese usuario
- Se mantiene un contador de errores para el informe final

### 7.3 Errores en el proceso global:

```javascript
sendEmails().catch(e => 
  console.error('Error en el proceso de envío de emails:', e)
);
```

- La función completa de envío tiene manejo de errores a nivel global
- Si ocurre un error catastrófico, se registra pero no afecta a la respuesta de la API
- La API responde exitosamente incluso si hay problemas con los emails

---

## 8. Solución de Problemas Comunes

### 8.1 Los emails no se envían:

- **Verificar credenciales**: Confirmar que la API Key de SendGrid es correcta y está activa
- **Verificar remitente**: Asegurarse de que el email remitente está verificado en SendGrid
- **Revisar logs**: Buscar errores específicos en los logs del servidor
- **Límites de SendGrid**: Verificar si se ha alcanzado el límite de envíos diarios

### 8.2 Errores en el contenido del email:

- **Datos faltantes**: Verificar que los objetos `user` y `race` contengan todos los campos necesarios
- **Formato de fecha**: Comprobar que las fechas se formatean correctamente
- **Caracteres especiales**: Asegurarse de que los nombres y ubicaciones con caracteres especiales se muestran correctamente

### 8.3 Problemas de rendimiento:

- **Muchos participantes**: Para carreras con muchos participantes, considerar enviar los emails en lotes
- **Tiempo de respuesta**: Si la API tarda demasiado en responder, verificar que los emails se estén enviando realmente en segundo plano



