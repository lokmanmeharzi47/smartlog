import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { context } = body;

    if (!context) {
      return NextResponse.json({ error: 'Context is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error: 'Failed to generate recommendation',
          details: 'GEMINI_API_KEY is not set. Please add it to your Vercel environment variables.',
        },
        { status: 500 }
      );
    }

    // Initialize the Google Gen AI SDK using Google AI Studio (API key, no Vertex AI)
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
You are an expert AI logistics and warehouse management assistant for a system called "SmartLog".
You are asked to explain a specific AI recommendation for a warehouse product.

Here is the context of the recommendation:
${JSON.stringify(context, null, 2)}

Provide a clear, detailed, and strategic explanation for this recommendation.
Include:
1. Why this recommendation was triggered (based on the provided context like stock levels, anomaly, or forecast).
2. The potential risks if this action is not taken.
3. A clear, actionable step for the warehouse manager.

Format your response in clean markdown, using bullet points or bold text where appropriate to make it easy to read. Keep the tone professional, concise, and helpful. Do not output anything other than the explanation itself.
`;

    const response = await ai.models.generateContent({
      model: 'gemma-4-31b-it',
      contents: prompt,
    });

    return NextResponse.json({ explanation: response.text || 'Aucune réponse générée.' });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error generating AI recommendation:', err);
    return NextResponse.json(
      { error: 'Failed to generate recommendation', details: err.message },
      { status: 500 }
    );
  }
}
