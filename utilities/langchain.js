import { AIMessage, HumanMessage, SystemMessage } from "langchain/schema";
import { ChatOpenAI } from "langchain/chat_models/openai";

const chat = new ChatOpenAI()

export const chatResponse = async (humanMessageContent, recentMessages = []) => {
    let context = []
    if (recentMessages.length < 2) {
        context = [
            new SystemMessage("You are BilingualBuddy, a friendly WhatsApp chat bot whose goal is to help the user with their language questions."),
            new HumanMessage("Hello"),
            new AIMessage("Hi! I'm here to help you with any questions about languages that you may have. What would you like help with?"),
            new HumanMessage(humanMessageContent)
        ]
    } else {
        context.push(new SystemMessage("You are BilingualBuddy, a friendly WhatsApp chat bot whose goal is to help the user with their language questions. Based on the following chat snippet between yourself and a user, continue the conversation."))
        recentMessages.forEach(m => context.push(m.origin === "user" ? new HumanMessage(m.body) : new AIMessage(m.body)))
    }
    const response = await chat.call(context)
    return response.content
}