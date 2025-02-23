// app/api/sign/route.ts
import { NextResponse } from "next/server";
import { createSign } from "crypto";

export async function POST(request: Request) {
  try {
    const { xml, certificate, privateKey } = await request.json();

    if (!xml || !certificate || !privateKey) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Gerçek XML imzalama işlemi
    const sign = createSign("RSA-SHA256");
    sign.update(xml);
    sign.end();
    const signature = sign.sign(privateKey, "base64");

    const signedXML = `<?xml version="1.0" encoding="UTF-8"?>\n<Invoice>${xml}\n<Signature>${signature}</Signature></Invoice>`;

    return NextResponse.json({ signedXML, invoiceHash: signature });
  } catch (error) {
    return NextResponse.json({ error: "XML signing failed" }, { status: 500 });
  }
}
