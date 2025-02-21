import { NextRequest, NextResponse } from "next/server";
import { sendMail } from "@/lib/email"; // la ruta que corresponda

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        sendMail(body.to, body.subject, body.htmlContent);
        return NextResponse.json({ succes: true });
    }catch (err) {
        return NextResponse.json({ succes: false, error: (err as Error).message});
    }
        
  
}
