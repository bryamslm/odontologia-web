import { NextRequest, NextResponse } from 'next/server';

const VERIFY_TOKEN = process.env.META_API_TOKEN;

// ✅ Ruta de verificación de Webhook
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log('Webhook verificado!');
        return new NextResponse(challenge, { status: 200 });
    } else {
        return new NextResponse('Forbidden', { status: 403 });
    }
}

// ✅ Ruta para recibir eventos de WhatsApp
export async function POST(req: NextRequest) {
    const body = await req.json();
    console.log('📩 Mensaje recibido:', JSON.stringify(body, null, 2));

    if (body.object === 'whatsapp_business_account') {
        body.entry.forEach((entry: any) => {
            entry.changes.forEach((change: any) => {
                if (change.value.messages) {
                    const message = change.value.messages[0];
                    console.log(`📨 Nuevo mensaje de ${message.from}: ${message.text.body}`);
                }
            });
        });
    }

    return new NextResponse('OK', { status: 200 });
}
