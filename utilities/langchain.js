import { AIMessage, HumanMessage, SystemMessage } from "langchain/schema";
import { ChatOpenAI } from "langchain/chat_models/openai";

const chat = new ChatOpenAI({ model_name: "gpt-3.5-turbo", temperature: 0.3 })

export const chatResponse = async (humanMessageContent, recentMessages = []) => {
    let context
    if (recentMessages.length < 2) {
        context = [
            SystemMessage("You are BilingualBuddy, a friendly WhatsApp chat bot whose goal is to help the user with their language questions."),
            HumanMessage("Hello"),
            AIMessage("Hi! I'm here to help you with any questions about languages that you may have. What would you like help with?"),
            HumanMessage(humanMessageContent)
        ]
    } else {
        context = recentMessages.map((m) => {
            switch (m.type) {
                case "human":
                    return HumanMessage(m.text)
                case "ai":
                    return AIMessage(m.origin)
            }
        })
    }

    const response = chat.call(context)
    return response
}