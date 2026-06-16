import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { context } = body;

    if (!context) {
      return NextResponse.json({ error: 'Context is required' }, { status: 400 });
    }

    const project = process.env.GOOGLE_CLOUD_PROJECT;
    if (!project) {
      return NextResponse.json(
        { error: 'GOOGLE_CLOUD_PROJECT is not configured' },
        { status: 500 }
      );
    }

    const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';

    // Initialize the new Google Gen AI SDK for Vertex AI (Google Cloud)
    const ai = new GoogleGenAI({
      project: project,
      location: location,
      vertexai: true
    });

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
      model: 'gemini-1.5-flash',
      contents: prompt,
    });

    return NextResponse.json({ explanation: response.text || 'Aucune réponse générée.' });
  } catch (error: any) {
    console.error('Error generating AI recommendation with @google/genai:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendation', details: error.message },
      { status: 500 }
    );
  }
}
