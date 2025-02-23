import { NextResponse } from "next/server";
import forge from "node-forge";

interface CreateCsrRequest {
  organization: string;
  organizationalUnit: string;
  commonName: string;
}

export async function POST(request: Request) {
  try {
    // request.body yalnızca bir kere okunmalı
    const body = await request.json();
    const { organization, organizationalUnit, commonName } = body as CreateCsrRequest;

    // Basit validasyon
    if (!organization || !organizationalUnit || !commonName) {
      return NextResponse.json(
        { error: "Eksik parametre: organization, organizationalUnit veya commonName" },
        { status: 400 }
      );
    }

    // RSA anahtar çifti oluşturma
    const keys = forge.pki.rsa.generateKeyPair(2048);

    // CSR oluşturma
    const csr = forge.pki.createCertificationRequest();
    csr.publicKey = keys.publicKey;
    csr.setSubject([
      { name: 'countryName', value: 'SA' },
      { name: 'organizationName', value: organization },
      { shortName: 'OU', value: organizationalUnit },
      { name: 'commonName', value: commonName }
    ]);

    // CSR'yi imzala
    csr.sign(keys.privateKey, forge.md.sha256.create());

    // CSR ve Private Key PEM formatına dönüştürülür
    const csrPem = forge.pki.certificationRequestToPem(csr);
    const privateKeyPem = forge.pki.privateKeyToPem(keys.privateKey);

    return NextResponse.json({ csr: csrPem, privateKey: privateKeyPem });
  } catch (error) {
    console.error("CSR Oluşturma Hatası:", error);
    return NextResponse.json(
      { error: "CSR oluşturulamadı. Lütfen girdilerinizi kontrol edin.", details: error instanceof Error ? error.message : error },
      { status: 500 }
    );
  }
}
