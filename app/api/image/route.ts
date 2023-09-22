import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { amount = 1, prompt, resolution = "256x256" } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!openai.apiKey) {
            return new NextResponse("OpenAI Api Key Not Config", {
                status: 500,
            });
        }

        if (!amount) {
            return new NextResponse("Amount Not Found", { status: 400 });
        }
        if (!prompt) {
            return new NextResponse("Prompt Not Found", { status: 400 });
        }
        if (!resolution) {
            return new NextResponse("Resolution Not Found", { status: 400 });
        }

        const response = await openai.images.generate({
            prompt,
            n: parseInt(amount, 10),
            size: resolution,
        });

        return NextResponse.json(response.data, {
            status: 200,
        });
    } catch (err) {
        console.log("Error in Image route", err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
