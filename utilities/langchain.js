import { AIMessage, HumanMessage, SystemMessage } from "langchain/dist/schema";
import { ChatOpenAI } from "langchain/chat_models/openai";

const chat = ChatOpenAI(model_name = "gpt-3.5-turbo", temperature = 0.3)

export const chatResponse = async (humanMessageContent) => {
    const messages = [
        SystemMessage(content = "You are BilingualBuddy, a friendly WhatsApp chat bot whose goal is to help the user with their language questions."),
        HumanMessage(content="Hello. Here is some information about me. I live in Colombia. I am from United States. I am learning Spanish"),
        AIMessage(content="Great! I'm here to help you with any questions you may have. What would you like help with?"),
        HumanMessage(content = humanMessageContent)
    ]
    const response = chat.call(messages)
    return response
}