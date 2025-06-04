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
    to: 'daniel.a@ultimmarketing.com',
    cc: [],
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