import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN!,
});

export async function POST(req: Request) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { prompt } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!prompt) {
            return new NextResponse("Prompt Not Found", { status: 400 });
        }

        const response = await replicate.run(
            "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
            {
                input: {
                    prompt: prompt,
                },
            }
        );

        return NextResponse.json(response, { status: 200 });
    } catch (err) {
        console.log("Error in Video route", err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}