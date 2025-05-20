import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
// Supabase connection
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);
// Función para brindar canal de contacto de otros servicios diferentes a servicios contables y de revisoría fiscal ofrecidos por Fenix Medellín
export function contactCustomerService() {
    const customerServiceData = {
        whatsapp: "https://wa.me/573104000000",
        description: "Linea de atención especializada para otros servicios.",
    };
    return JSON.stringify(customerServiceData);
}
