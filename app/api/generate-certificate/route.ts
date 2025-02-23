import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Body'yi yalnızca bir kere okuyun
    const body = await request.json();
    const { environment, csr } = body;

    if (!environment || !csr) {
      return NextResponse.json(
        { error: "Eksik parametre: environment veya csr" },
        { status: 400 }
      );
    }

    // OTP'yi header'dan alıyoruz
    const otp = request.headers.get("OTP")?.trim();

    // Production ortamında 6 haneli OTP kontrolü
    if (environment === "production" && (!otp || !/^\d{6}$/.test(otp))) {
      return NextResponse.json(
        { error: "Geçersiz OTP formatı" },
        { status: 400 }
      );
    }

    // Burada CSR'yi kullanarak ZATCA API'sine istek atma işlemleri yapılır.
    // (Bu örnekte, dummy bir yanıt döndürüyoruz.)
    const dummyResponse = {
      signedCertificate: "BASE64_SIGNED_CERTIFICATE_FROM_ZATCA"
    };

    return NextResponse.json(dummyResponse, { status: 200 });
  } catch (error: any) {
    console.error("Sunucu Hatası Detayları:", error);
    return NextResponse.json(
      { error: "Sertifika imzalama başarısız", details: error instanceof Error ? error.message : "Bilinmeyen hata" },
      { status: 500 }
    );
  }
}
