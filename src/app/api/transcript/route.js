import { NextResponse } from 'next/server'
import { transcript } from '../../../../utilities'
export async function POST(req) {
    const body = await req.json()
    const text = await transcript(body.url)
    const res = { text }
    return NextResponse.json(res)
}