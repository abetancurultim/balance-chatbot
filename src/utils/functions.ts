import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { log } from 'node:console';

dotenv.config();

// Supabase connection
const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_KEY as string;
export const supabase = createClient(supabaseUrl, supabaseKey);


// Función para brindar canal de contacto de otros servicios ofrecidos por Balance
export function contactCustomerService() {
  const customerServiceData = {
    whatsapp: "https://wa.me/573104000000",
    description: "Linea de atención especializada para otros servicios ofrecidos por Balance.",
  };

  return JSON.stringify(customerServiceData);
}

// Guardar los datos del cliente, nombre, telefono y correo
export async function saveClientData(name: string, phone: string, email: string, message: string) {
  log("Guardando datos del cliente:", name, phone, email,message);
  try {
    const { data, error } = await supabase
      .from('clients')
      .insert([
        { name: name, phone: phone, email: email,message: message },
        ]);
    
    console.log('Datos guardados en Supabase:', name, phone, email,message);
    sendEmailNotification(name, phone, email,message);



    if (error) {
        // Mostrar error en consola si no se guardan los datos
        console.error("Error al guardar los datos del cliente:", error);
        throw error;
        }
    return "Datos del cliente guardados correctamente.";
    } catch (error) {
        console.log("Error al guardar los datos del cliente:", error);
        throw error;
    }
}


async function sendEmailNotification(name: string, phone: string, email: string, message: string) {
  const transporter = nodemailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 587,
    auth: {
      user: "apikey",
      pass: process.env.SENDGRID_API_KEY,
    },
  });

  const mailOptions = {
    from: '"¡Nuevo contacto!" <grow@ultimmarketing.com>',
    to: 'alejandro.r@ultimmarketing.com',
    cc: ["mariela@ultimmarketing.com","daniel.a@ultimmarketing.com"],
    subject: 'Balance - Nuevo cliente registrado de WhatsApp',
    text: `¡Nuevo cliente registrado de WhatsApp! \n\nNombre: ${name} \nCelular: ${phone} \nCorreo: ${email} \n ${message}\nPor favor, contacta al cliente lo antes posible para coordinar una cita.`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return "Email enviado correctamente.";
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Función para notificar nueva conversación iniciada
export async function sendNewConversationNotification(phone: string) {
  const transporter = nodemailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 587,
    auth: {
      user: "apikey",
      pass: process.env.SENDGRID_API_KEY,
    },
  });

  const mailOptions = {
    from: '"Nueva conversación - Balance" <grow@ultimmarketing.com>',
    to: 'daniel.a@ultimmarketing.com',
    cc: ["alejandro.r@ultimmarketing.com", "mariela@ultimmarketing.com"],
    subject: 'Balance - Nueva conversación iniciada en WhatsApp',
    text: `¡Nueva conversación iniciada en WhatsApp! \n\nNúmero de teléfono: ${phone} \nFecha y hora: ${new Date().toLocaleString('es-ES', { timeZone: 'America/New_York' })} \n\nUn nuevo cliente ha iniciado conversación con el chatbot de Balance. Mantente atento para posibles seguimientos.`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('New conversation notification sent:', info.response);
    return "Notificación de nueva conversación enviada correctamente.";
  } catch (error) {
    console.error('Error sending new conversation notification:', error);
    // No lanzar error para que no afecte el flujo principal
    return "Error enviando notificación de nueva conversación.";
  }
};

// Función para verificar si es una nueva conversación
export async function isNewConversation(phone: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('chat_history')
      .select('id')
      .eq('client_number', phone)
      .limit(1);

    if (error) {
      console.error('Error checking if new conversation:', error);
      return false; // En caso de error, asumir que no es nueva para evitar spam
    }

    // Si no hay datos, es una nueva conversación
    return !data || data.length === 0;
  } catch (error) {
    console.error('Error in isNewConversation:', error);
    return false;
  }
};