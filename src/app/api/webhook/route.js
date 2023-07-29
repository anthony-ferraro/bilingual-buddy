import { transcribe, translate, login, createTwimlMessage, logMessage, chatResponse } from '../../../../utilities';
export async function POST(req) {
    try {
        const body = await req.text()
        const searchParams = new URLSearchParams(body)
        const AccountSid = searchParams.get("AccountSid")
        if (AccountSid === null || AccountSid !== process.env.TWILIO_ACCOUNT_SID) {
            //reject unauthorized webhook request
            return new Response("Unauthorized", {
                status: 401,
                headers: { 'Content-Type': 'text/xml' }
            })
        }
        const WaId = searchParams.get("WaId")
        const user = await login(WaId)

        const NumMedia = searchParams.get("NumMedia")
        const MediaUrl = searchParams.get("MediaUrl0")
        const MediaContentType = searchParams.get("MediaContentType0")
        const Body = searchParams.get("body")

        //change below to check billing status
        if (user.type !== "admin") {
            await logMessage(user.id, { body: Body, origin: "user", media: "", mediaType: "" })
            const text = "Sorry, I can't answer that" + JSON.stringify(user)
            const message = createTwimlMessage(text)
            await logMessage(user.id, { body: text, origin: "ai", media: "", mediaType: "" })
            return new Response(message, {
                status: 200,
                headers: { 'Content-Type': 'text/xml' }
            })
        }

        if (NumMedia === "0") {
            await logMessage(user.id, { body: Body, origin: "user", media: "", mediaType: "" })
            const text = await chatResponse(Body)
            const message = createTwimlMessage(text)
            await logMessage(user.id, { body: text, origin: "ai", media: "", mediaType: "" })
            return new Response(message, {
                status: 200,
                headers: { 'Content-Type': 'text/xml' }
            })
        } else {
            await logMessage(user.id, { body: Body, origin: "user", media: MediaUrl, mediaType: MediaContentType })
            const transcribedText = await transcribe(MediaUrl)
            const targetLanguage = 'en'
            const translation = await translate(transcribedText, targetLanguage)
            const message = createTwimlMessage(translation.translatedText)
            await logMessage(user.id, { body: translation.translatedText, origin: "ai", media: "", mediaType: "" })
            return new Response(message, {
                status: 200,
                headers: { 'Content-Type': 'text/xml' }
            })
        }
    }
    catch (ex) {
        const text = "Sorry, I can't answer that" + ex.message + ex.stack
        const message = createTwimlMessage(text)
        logMessage(user.id, { body: text, origin: "ai", media: "", mediaType: "" })
        return new Response(message, {
            status: 200,
            headers: { 'Content-Type': 'text/xml' }
        })
    }
}