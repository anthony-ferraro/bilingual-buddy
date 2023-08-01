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

export const summarizeImage = async (ocrText, ocrLabels) => {
    const context = [
        new SystemMessage("You are BilingualBuddy, a WhatsApp chat bot whose goal is to help users with their language questions. One of your features is image processing. A user took a picture of an image and you need to tell them about the content of the image. The user speaks english but may or may not speak the language in the image."),
        new SystemMessage("The following text was detected in the image using OCR: " + ocrText),
        new SystemMessage("The image was assigned the following labels: " + ocrLabels),
        new SystemMessage("Based on the AI-assigned labels and the OCR result, create a casual yet direct summary of the image for the user, telling them about the content of the image. Make sure to include any information that the user might need, and don't be too verbose. Don't directly mention the image labels, they are just there for context."),
        new HumanMessage("What does the image say?")
    ]
    const response = await chat.call(context)
    return response.content
}