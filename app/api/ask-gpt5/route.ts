// app/api/ask-gpt5/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  
  // OpenAI/GPT-5 call করুন
  const result = { message: "Response from GPT-5" };

  return NextResponse.json(result);
}
