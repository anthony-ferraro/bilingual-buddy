import MessagingResponse from 'twilio/lib/twiml/MessagingResponse'
import { transcript, translate } from '../../../../utilities';

export async function POST(req) {
    let message
    const targetLanguage = 'en'
    const twiml = new MessagingResponse();
    const { searchParams } = new URL(req.url)
    const NumMedia = searchParams.get("NumMedia")
    const MediaUrl0 = searchParams.get("MediaUrl0")


    if (NumMedia === "0") {
        message = twiml.message("No media attached")
        return new Response(message, {
            status: 200,
            headers: { 'Content-Type': 'text/xml' }
        })
    } else {
        const transcriptedText = await transcript(MediaUrl0)
        const translatedText = await translate(transcriptedText, targetLanguage)
        message = twiml.message(transcriptedText + "\n" + translatedText).toString()
        return new Response(message, {
            status: 200,
            headers: { 'Content-Type': 'text/xml' }
        })
    }
}