import { NextResponse } from 'next/server'
import { translate } from '../../../../utilities'
export async function POST(req) {
    const body = await req.json()
    const translation = await translate(body.text, body.targetLanguage)
    const res = { text: translation.translatedText }
    return NextResponse.json(res)
}