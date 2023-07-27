import { NextResponse } from 'next/server'
import { translate } from '../../../../utilities'
export async function POST(req) {
    const body = await req.json()
    const text = await translate(body.text, body.targetLanguage)
    const res = { text }
    return NextResponse.json(res)
}