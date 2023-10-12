import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "",
});

export const runtime = "edge";

export async function POST(req: Request): Promise<Response> {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "") {
        return new Response(
            "Missing OPENAI_API_KEY – make sure to add it to your .env file.",
            {
                status: 400,
            },
        );
    }
    if (
        process.env.NODE_ENV != "development" &&
        process.env.KV_REST_API_URL &&
        process.env.KV_REST_API_TOKEN
    ) {
    }

    let { prompt } = await req.json();

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content:
                    "You are an AI assistant that helps users to identify books based on the their description" +
                    "If description includes author, publication year, or genre, use those variables" +
                    "to identify a book, but do not prioritize them as they could be misleading" +
                    "You should response with just the book title or multiple, separated by a comma." +
                    "If you did not find any book that matches the description respond with 'No Book Found'"
            },
            {
                role: "user",
                content: prompt,
            },
        ],
        temperature: 0.4,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        stream: true,
        n: 1,
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
}
