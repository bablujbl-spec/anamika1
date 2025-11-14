import type { NextApiRequest, NextApiResponse } from "next";

interface AskRequestBody {
  message: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const body: AskRequestBody = req.body;
    // এখানে OpenAI GPT-5 API call করবে
    // উদাহরণ: echo reply
    const reply = `Echo: ${body.message}`;
    res.status(200).json({ reply });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}
