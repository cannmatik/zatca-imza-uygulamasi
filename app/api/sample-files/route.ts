// app/api/sample-files/route.ts
import { getSampleFiles } from '../../../utils/getSampleFiles';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  const basePath = path.join(process.cwd(), "public", "Sample_xml");
  const files = getSampleFiles(basePath);
  return NextResponse.json({ files });
}
