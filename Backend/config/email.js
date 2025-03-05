import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

// Configurar la API key de SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Envía un correo con los resultados de la carrera al participante
 * @param {Object} user - Usuario/participante
 * @param {Object} race - Información de la carrera
 * @param {Object} results - Resultados del participante (tiempo, posición)
 * @returns {Promise<boolean>} - True si el envío fue exitoso
 */
export const sendRaceResultsEmail = async (user, race, results) => {
  try {
    const formattedTime = results.time || "No registrado";
    const position = results.position
      ? `${results.position}º`
      : "No disponible";

    const msg = {
      to: user.email,
      from: process.env.SENDGRID_FROM_EMAIL, // Email verificado del proyecto
      subject: `Resultados - ${race.name}`,
      text: `¡Hola ${user.name}! Aquí están tus resultados para ${race.name}:\n\nPosición: ${position}\nTiempo: ${formattedTime}\n\nGracias por participar!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 5px;">
          <h2 style="color: #3498db;">Resultados de Carrera</h2>
          <p>¡Hola <strong>${user.name}</strong>!</p>
          <p>Aquí están tus resultados para <strong>${race.name}</strong>:</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <p><strong>Fecha:</strong> ${new Date(
              race.date
            ).toLocaleDateString()}</p>
            <p><strong>Ubicación:</strong> ${race.location}</p>
            <p><strong>Distancia:</strong> ${race.distance} km</p>
            <p><strong>Posición:</strong> ${position}</p>
            <p><strong>Tiempo:</strong> ${formattedTime}</p>
          </div>
          
          <p>¡Gracias por participar!</p>
          <p style="font-size: 12px; color: #777; margin-top: 30px;">Este es un correo automático, por favor no respondas a este mensaje.</p>
        </div>
      `,
    };

    await sgMail.send(msg);
    console.log(`Email enviado a ${user.email}`);
    return true;
  } catch (error) {
    console.error("Error al enviar email:", error);
    return false;
  }
};


/**
 * TEST
 * @param {Object} user - Usuario/participante
 * @param {Object} race - Información de la carrera
 * @param {Object} results - Resultados del participante (tiempo, posición)
 */
export const testRaceResultsEmail = async (user, race, results) => {
  const formattedTime = results.time || 'No registrado';
  const position = results.position ? `${results.position}º` : 'No disponible';
  
  const msg = {
    to: user.email,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: `[TEST] Resultados - ${race.name}`,
    // ... resto igual a sendRaceResultsEmail
  };
  
  // Solo mostrar el email en la consola sin enviarlo
  console.log('========= TEST EMAIL =========');
  console.log('To:', msg.to);
  console.log('Subject:', msg.subject);
  console.log('Text content:', msg.text);
  console.log('=============================');
  
  return true;
};