import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

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