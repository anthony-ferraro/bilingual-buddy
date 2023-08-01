import MessagingResponse from 'twilio/lib/twiml/MessagingResponse'
// import { Twilio } from 'twilio';

// const client = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

export const createTwimlMessage = (message) => {
    const twiml = new MessagingResponse();
    return twiml.message(message)
}