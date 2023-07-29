import MessagingResponse from 'twilio/lib/twiml/MessagingResponse'

export const createTwimlMessage = (message) => {
    const twiml = new MessagingResponse();
    return twiml.message(message)
}