import { checkApiLimit, incrementApiLimit } from "@/lib/api-limit";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const instructionMessage: OpenAI.Chat.CreateChatCompletionRequestMessage = {
    role: "system",
    content:
        "You are a code generator. You must answer only in markdown code snippets. Use code comments for explanations.",
};

export async function POST(req: Request) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { messages } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!openai.apiKey) {
            return new NextResponse("OpenAI Api Key Not Config", {
                status: 500,
            });
        }

        if (!messages) {
            return new NextResponse("Message Not Found", { status: 400 });
        }

        const freeTrial = await checkApiLimit();

        if (!freeTrial) {
            return new NextResponse("Free Trail has Expired", { status: 403 });
        }

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [instructionMessage, ...messages],
        });

        await incrementApiLimit();

        return NextResponse.json(response.choices[0].message, {
            status: 200,
        });
    } catch (err) {
        console.log("Error in code route", err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
