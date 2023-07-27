import { Configuration, OpenAIApi } from 'openai'
import { Readable } from 'stream';
import fetch from 'node-fetch';
import { TranslationServiceClient } from '@google-cloud/translate';
import { Translate } from '@google-cloud/translate/build/src/v2';

export const transcript = async (url) => {
    // Fetch the remote file into a buffer
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();

    // Convert the ArrayBuffer into a Buffer
    const buffer = Buffer.from(arrayBuffer);

    const audioReadStream = Readable.from(buffer);
    audioReadStream.path = 'conversation.wav';

    // Create a Readable stream from the buffer
    // const readableStream = new Readable();
    // readableStream.push(buffer);
    // readableStream.push(null); // Signal that the stream should end

    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const transcript = await openai.createTranscription(
        audioReadStream,
        "whisper-1"
    );
    console.log(transcript)
    return transcript.data.text
}

export const translate = async (text, targetLanguage) => {
    const credential = JSON.parse(
        Buffer.from(process.env.GOOGLE_SERVICE_KEY, "base64").toString()
    );
    const client = new TranslationServiceClient({
        credentials: {
            client_email: credential.client_email,
            private_key: credential.private_key,
        },
    })

    const projectId = process.env.GCLOUD_PROJECT_ID
    const location = "global"

    const request = {
        parent: `projects/${projectId}/locations/${location}`,
        contents: [text],
        mimeType: "text/plain",
        targetLanguageCode: targetLanguage,
    };
    
    const [response] = await client.translateText(request);
    console.log(response)
    return (response.translations[0].translatedText);
}