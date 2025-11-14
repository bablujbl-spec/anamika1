const router = useRouter();
router.push("/chat");

interface AskRequestBody {
  question: string;
}

export async function POST(req: Request): Promise<Response> {
  try {
    const data: AskRequestBody = await req.json();

    if (!data.question) {
      return NextResponse.json(
        { error: "Question is required." },
        { status: 400 }
      );
    }

    // এখানে আপনি GPT API বা আপনার লজিক কল করবেন
    const answer = `Your question was: "${data.question}"`;

    return NextResponse.json({ answer }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error in ask-gpt5 route:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
