import {
    transcribe,
    translate,
    login,
    createTwimlMessage,
    logMessage,
    chatResponse,
    retrieveRecentMessages,
    logError,
    labelImage,
    detectText,
    summarizeImage
} from '../../../../utilities';
export async function POST(req) {
    let user
    try {
        const body = await req.text()
        const searchParams = new URLSearchParams(body)
        const AccountSid = searchParams.get("AccountSid")
        const userMessageTimestamp = Math.floor(new Date() / 1000)

        if (AccountSid === null || AccountSid !== process.env.TWILIO_ACCOUNT_SID) {
            //reject unauthorized webhook request
            return new Response("Unauthorized", {
                status: 401,
                headers: { 'Content-Type': 'text/xml' }
            })
        }

        const WaId = searchParams.get("WaId")
        user = await login(WaId)
        //change below to check billing status
        if (user.payplan === "none" && user.type !== "admin") {
            const text = "Sorry, it looks like you aren't authorized. Please set up your account using the link below"
            const message = createTwimlMessage(text)
            return new Response(message, {
                status: 200,
                headers: { 'Content-Type': 'text/xml' }
            })
        }

        const NumMedia = searchParams.get("NumMedia")
        const MediaUrl = searchParams.get("MediaUrl0")
        const MediaContentType = searchParams.get("MediaContentType0")
        const Body = searchParams.get("Body")

        //is message a media message?
        if (NumMedia !== "0") {
            if (MediaContentType.includes("audio")) {
                //handle audio message
                const transcribedText = await transcribe(MediaUrl)
                const targetLanguage = 'en'
                const translation = await translate(transcribedText, targetLanguage)
                const message = createTwimlMessage(translation.translatedText)
                logMessage(user.id, { body: Body, origin: "user", media: MediaUrl, mediaType: MediaContentType })
                logMessage(user.id, { body: translation.translatedText, origin: "ai", media: "", mediaType: "" })
                return new Response(message, {
                    status: 200,
                    headers: { 'Content-Type': 'text/xml' }
                })
            } else if (MediaContentType.includes("video")) {
                //handle video
                const message = "Sorry, this media type is not yet supported"
                return new Response(message, {
                    status: 200,
                    headers: { 'Content-Type': 'text/xml' }
                })
            } else if (MediaContentType.includes("image")) {
                //handle image
                const [ocrText, ocrLabels] = await Promise.all([detectText(MediaUrl), labelImage(MediaUrl)])
                console.log(ocrText)
                console.log(ocrLabels)
                // const imageSummary = await summarizeImage(ocrText, ocrLabels)
                const message = "Sorry, this media type is not yet supported."
                return new Response(message, {
                    status: 200,
                    headers: { 'Content-Type': 'text/xml' }
                })
            } else {
                //MIME type of application/* or text/*
                //handle unsupported media type
                const message = "Sorry, this media type is not yet supported."
                return new Response(message, {
                    status: 200,
                    headers: { 'Content-Type': 'text/xml' }
                })
            }
        }

        //handle non-media (text) message
        const recentMessages = await retrieveRecentMessages(user.id)
        recentMessages.push({ body: Body, origin: "user", media: "", mediaType: "" })
        const text = await chatResponse(Body, recentMessages)
        const message = createTwimlMessage(text)
        logMessage(user.id, { body: Body, origin: "user", media: "", mediaType: "" }, userMessageTimestamp)
        logMessage(user.id, { body: text, origin: "ai", media: "", mediaType: "" })
        return new Response(message, {
            status: 200,
            headers: { 'Content-Type': 'text/xml' }
        })

    }
    catch (ex) {
        const text = "Sorry, I wasn't able to answer that. Please try again later."
        logError(ex, user)
        const message = createTwimlMessage(text)
        return new Response(message, {
            status: 200,
            headers: { 'Content-Type': 'text/xml' }
        })
    }
}