import dotenv from 'dotenv';
import { ChatOpenAI } from "@langchain/openai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { BaseMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import { 
    retrieverTool,
    setAvailableForAudioTool,
    saveClientDataTool,
} from '../tools/tools.js';
import { MESSAGES } from '../config/constants.js';
import { exportedFromNumber } from '../routes/chatRoutes.js';

dotenv.config();

const memory = new MemorySaver();

const llm = new ChatOpenAI({ 
    temperature: 0,
    model: "gpt-4o",
    apiKey: process.env.OPENAI_API_KEY,
    maxTokens: 260,
});

const tools = [
    retrieverTool,
    saveClientDataTool,
    setAvailableForAudioTool,
];

const modifyMessages = (messages: BaseMessage[]) => {
    return [
      new SystemMessage(MESSAGES.SYSTEM_PROMPT),
      new HumanMessage(`Este es el número de teléfono: ${exportedFromNumber}`),
      ...messages,
    ];
};

export const appWithMemory = createReactAgent({
    llm,
    tools,
    messageModifier: modifyMessages,
    checkpointSaver: memory,
});