/**
 * BISync POS - Colector de Prospectos (Google Apps Script)
 * =========================================================
 * Este script recibe los datos del formulario de la página web (bisync-pos-web),
 * los guarda como una nueva fila en Google Sheets y te envía un correo
 * instantáneo a tu cuenta de Google con los datos del cliente.
 * 
 * INSTRUCCIONES DE INSTALACIÓN:
 * 1. Abre Google Sheets (https://sheets.new) y crea una nueva hoja llamada:
 *    "BISync POS - Prospectos"
 * 
 * 2. En la Fila 1, coloca estos encabezados en las columnas A hasta G:
 *    A1: Fecha y Hora
 *    B1: Nombre
 *    C1: Correo Electrónico
 *    D1: Teléfono / WhatsApp
 *    E1: Negocio / Comercio
 *    F1: Plan de Interés
 *    G1: Mensaje
 * 
 * 3. En el menú superior de Google Sheets, ve a:
 *    Extensiones > Apps Script
 * 
 * 4. Borra el código existente en "Código.gs" y pega todo este archivo.
 * 
 * 5. Reemplaza 'TU_CORREO_AQUI@GMAIL.COM' por tu correo de Google donde quieres
 *    recibir las alertas (por ejemplo tu correo de Google de BISync).
 * 
 * 6. Haz clic en "Guardar" (ícono de disquete).
 * 
 * 7. Haz clic en el botón azul superior "Implementar" > "Nueva implementación".
 *    - Tipo: Selecciona "Aplicación web" (ícono de engranaje).
 *    - Descripción: Webhook BISync POS
 *    - Ejecutar como: "Yo" (tu cuenta de Google)
 *    - Quién tiene acceso: "Cualquier usuario" (Anyone) -> [IMPORTANTE: debe ser "Cualquier usuario"]
 * 
 * 8. Haz clic en "Implementar", autoriza los permisos de tu cuenta de Google.
 * 
 * 9. Copia la "URL de la aplicación web" que termina en /exec
 *    Ejemplo: https://script.google.com/macros/s/AKfycb.../exec
 * 
 * 10. Pega esa URL en:
 *     src/components/ContactForm.astro -> const GOOGLE_SCRIPT_WEBHOOK_URL = "...";
 */

// CONFIGURACIÓN: Ingresa tu correo donde deseas recibir las alertas
const NOTIFICATION_EMAIL = "ventas@bisync.com"; // <-- Cambia esto por tu correo real de Google

function doPost(e) {
  try {
    let data;
    
    // Parsear el cuerpo de la petición (JSON)
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter;
      }
    } else {
      data = e.parameter || {};
    }

    const timestamp = new Date();
    const name = data.name || "Sin nombre";
    const email = data.email || "Sin email";
    const phone = data.phone || "Sin teléfono";
    const business = data.business || "No especificado";
    const plan = data.plan || "Consulta General";
    const message = data.message || "Sin comentarios";

    // 1. Guardar en la hoja activa de Google Sheets
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet.appendRow([
      timestamp.toLocaleString("es-ES", { timeZone: "America/Caracas" }), // Ajusta tu zona horaria si lo deseas
      name,
      email,
      phone,
      business,
      plan,
      message
    ]);

    // 2. Enviar correo de notificación a tu cuenta de Google
    const recipient = NOTIFICATION_EMAIL || Session.getActiveUser().getEmail();
    const subject = "⚡ Nuevo interesado en BISync POS: " + name + " (" + plan + ")";

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #ffffff;">
        <div style="border-bottom: 2px solid #1D61E0; padding-bottom: 15px; margin-bottom: 20px;">
          <h2 style="color: #1D61E0; margin: 0;">BISync POS — Nuevo Prospecto</h2>
          <p style="color: #666666; font-size: 13px; margin: 5px 0 0 0;">Has recibido una nueva solicitud desde la web oficial.</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 10px 0; color: #555555; width: 140px; font-weight: bold;">Cliente:</td>
            <td style="padding: 10px 0; color: #111111; font-weight: bold;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #555555; font-weight: bold;">Correo:</td>
            <td style="padding: 10px 0;"><a href="mailto:${email}" style="color: #1D61E0; text-decoration: none;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #555555; font-weight: bold;">WhatsApp / Tel:</td>
            <td style="padding: 10px 0; color: #111111;">
              <a href="https://wa.me/${phone.replace(/[^0-9]/g, '')}" style="color: #00B074; font-weight: bold; text-decoration: none;">
                ${phone} (Clic para abrir WhatsApp)
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #555555; font-weight: bold;">Negocio / Rubro:</td>
            <td style="padding: 10px 0; color: #111111;">${business}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #555555; font-weight: bold;">Plan Seleccionado:</td>
            <td style="padding: 10px 0; color: #1D61E0; font-weight: bold;">${plan}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #555555; font-weight: bold; vertical-align: top;">Mensaje:</td>
            <td style="padding: 10px 0; color: #333333; line-height: 1.5;">${message}</td>
          </tr>
        </table>

        <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #eeeeee; text-align: center;">
          <a href="mailto:${email}?subject=Respuesta%20BISync%20POS%20-%20Plan%20${encodeURIComponent(plan)}" 
             style="display: inline-block; padding: 12px 24px; background-color: #1D61E0; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px;">
            Responder por Correo a ${name}
          </a>
        </div>
      </div>
    `;

    MailApp.sendEmail({
      to: recipient,
      subject: subject,
      htmlBody: htmlBody,
      replyTo: email
    });

    // 3. Responder con JSON de éxito
    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", message: "Lead registrado exitosamente" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
