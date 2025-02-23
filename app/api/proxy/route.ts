import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { environment, otp, ...body } = await request.json();
    const apiUrl =
      environment === "production"
        ? "https://gw-fatoora.zatca.gov.sa/e-invoicing/core/compliance"
        : environment === "simulation"
        ? "https://gw-fatoora.zatca.gov.sa/e-invoicing/simulation/compliance"
        : "https://gw-fatoora.zatca.gov.sa/e-invoicing/developer/compliance";

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) throw new Error("API request failed");

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}