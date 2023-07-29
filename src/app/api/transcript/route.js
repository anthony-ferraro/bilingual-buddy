import { NextResponse } from 'next/server'
import { transcribe } from '../../../../utilities'
export async function POST(req) {
    const body = await req.json()
    const text = await transcribe(body.url)
    const res = { text }
    return NextResponse.json(res)
}