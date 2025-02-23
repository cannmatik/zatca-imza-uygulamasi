// app/api/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import { exec } from 'child_process';
import path from 'path';

function execCommand(command: string): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(stderr);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

export async function POST(request: Request) {
  try {
    const {
      country,
      organization,
      organizationalUnit,
      commonName,
      registeredAddress,
      serialNumber,
      businessCategory,
      vatNumber,
      title,
      email,
      telephone,
    } = await request.json();

    const timestamp = Date.now();
    const csrFileName = `csr_${timestamp}.csr`;
    const keyFileName = `private_${timestamp}.key`;

    const subject = `/C=${country}/O=${organization}/OU=${organizationalUnit}/CN=${commonName}`;
    const opensslCommand = `openssl req -new -newkey rsa:2048 -nodes -keyout ${keyFileName} -out ${csrFileName} -subj "${subject}"`;

    await execCommand(opensslCommand);

    const csrPath = path.resolve(process.cwd(), csrFileName);
    const keyPath = path.resolve(process.cwd(), keyFileName);

    const csr = fs.readFileSync(csrPath, 'utf8');
    const privateKey = fs.readFileSync(keyPath, 'utf8');

    fs.unlinkSync(csrPath);
    fs.unlinkSync(keyPath);

    return NextResponse.json({ success: true, csr, privateKey }, { status: 200 });
  } catch (error: any) {
    console.error("Error generating CSR:", error);
    return NextResponse.json({ success: false, error: error.toString() }, { status: 500 });
  }
}