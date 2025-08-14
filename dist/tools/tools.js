import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { saveClientData } from '../utils/functions.js';
import { searchVectors } from "../utils/retrievers.js";
import { setAvailableForAudio } from "../utils/setAvailableForAudio.js";
export const retrieverTool = tool(async ({ query }) => {
    const results = await searchVectors(query);
    return results;
}, {
    name: "retriever",
    description: "Eres una herramienta de consulta de información sobre Fénix. Tu tarea es buscar y extraer solo la información relevante de la base de datos, respondiendo a las consultas de los clientes. Siempre entrega el resultado bien formateado para que sea facil de leer. Usa esta herramienta para responder preguntas específicas sobre preguntas frecuentes, politicas de devolucion e informacion general de la empresa, productos a la venta.",
    schema: z.object({
        query: z.string(),
    }),
});
export const saveClientDataTool = tool(async ({ name, phone, email, message }) => {
    const saveCliente = await saveClientData(name, phone, email, message);
    return saveCliente;
}, {
    name: 'guardar_datos_del_cliente',
    description: 'Guarda los datos del cliente en la base de datos. Esto lo debes hacer para garantizar un futuro contacto con el cliente por parte de un asesor real. Importante, esta tool solo se debe ejecutar cuando tengas el nombre, celular, correo del cliente, ciudad en donde requiere el servicio, servicio en el que está interesado y la fecha junto con la hora en que desea ser contactado. No la ejecutes si no tienes todos los datos completos.',
    schema: z.object({
        name: z.string(),
        phone: z.string(),
        email: z.string(),
        message: z.string(),
    }),
});
export const setAvailableForAudioTool = tool(async ({ isAvailableForAudio }) => {
    const preferences = setAvailableForAudio(isAvailableForAudio);
    return preferences;
}, {
    name: "can_the_client_answer_audios",
    description: "si el cliente manifiesta una preferencia por recibir la informacion por audio o por texto o que no puede escuchar audios, si el usuario no peude escuchar audios setea en la base de datos FALSE, si puede escuchar audios setea en la base de datos TRUE. Además, debes enviar nuevamente al cliente el último mensaje que recibió en texto para que lo pueda leer en caso de no poder recibir audios.",
    schema: z.object({
        isAvailableForAudio: z.boolean(),
    }),
});
