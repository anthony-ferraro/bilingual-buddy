import MessagingResponse from 'twilio/lib/twiml/MessagingResponse'
import { transcript } from '../../../../utilities';

export async function POST(req) {
    const body = await req.json()
    const twiml = new MessagingResponse();
    const transcriptedText = await transcript(body.MediaUrl0)
    const message = twiml.message(transcriptedText).toString()
    return new Response(message)
}