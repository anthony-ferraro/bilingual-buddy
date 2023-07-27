import MessagingResponse from 'twilio/lib/twiml/MessagingResponse'
import { transcript, translate } from '../../../../utilities';

export async function POST(req) {
    let message
    const twiml = new MessagingResponse();
    try {
        const targetLanguage = 'en'
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
    catch (ex) {
        const {searchParams} = new URL(req.url)
        const sp = Array.from(searchParams)
        const text = req.text()
        console.log(ex.message)
        message = twiml.message(`url: ${req.url}, text: ${text} name: ${ex.name}, message: ${ex.message}, stack: ${ex.stack}`)
        return new Response(message, {
            status: 200,
            headers: { 'Content-Type': 'text/xml' }
        })
    }
    
}