import MessagingResponse from 'twilio/lib/twiml/MessagingResponse'
import { transcript } from '../../../../utilities';

export async function POST(req) {
    const { searchParams } = new URL(req.url)
    const MediaUrl0 = searchParams.get("MediaUrl0")
    const twiml = new MessagingResponse();
    let message
    if (MediaUrl0 !== null) {
        const transcriptedText = await transcript(MediaUrl0)
        message = twiml.message(transcriptedText).toString()
    } else {
        message = twiml.message("There was an error" + JSON.stringify(searchParams)).toString()
    }

    return new Response(message, {
        status: 200,
        headers: { 'Content-Type': 'text/xml' }
    })
}