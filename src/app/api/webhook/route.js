import MessagingResponse from 'twilio/lib/twiml/MessagingResponse'
import { transcript } from '../../../../utilities';

export async function POST(req) {
    const { searchParams } = new URL(req.url)
    const NumMedia = searchParams.get("NumMedia")
    const MediaUrl0 = searchParams.get("MediaUrl0")
    const twiml = new MessagingResponse();
    let message
    if (NumMedia === "1") {
        const transcriptedText = await transcript(MediaUrl0)
        message = twiml.message(transcriptedText).toString()
    } else {
        message = twiml.message("Enter the correct number of media").toString()
    }

    return new Response(message, {
        status: 200,
        headers: { 'Content-Type': 'text/xml' }
    })
}