import { NextResponse } from 'next/server'
import { Configuration, OpenAIApi } from 'openai'
import { Readable } from 'stream';
import fetch from 'node-fetch';

export async function POST(req) {
    const body = await req.json()

    // Fetch the remote file into a buffer
    const response = await fetch(body.url);
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

    const res = {text: transcript.data.text}
    return NextResponse.json(res)
}