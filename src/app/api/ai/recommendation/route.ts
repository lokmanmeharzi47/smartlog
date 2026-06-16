import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';
import os from 'os';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { context } = body;

    if (!context) {
      return NextResponse.json({ error: 'Context is required' }, { status: 400 });
    }

    const project = process.env.GOOGLE_CLOUD_PROJECT || 'gen-lang-client-0498601710';
    const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';

    // --- Vercel / Serverless credential handling ---
    // Always prefer GOOGLE_CREDENTIALS_JSON (full JSON content as a string).
    // This avoids the GOOGLE_APPLICATION_CREDENTIALS file-path env var pointing
    // to a local Windows path that doesn't exist on Vercel's Linux servers.
    if (process.env.GOOGLE_CREDENTIALS_JSON) {
      const tmpKeyPath = path.join(os.tmpdir(), 'google-key.json');
      fs.writeFileSync(tmpKeyPath, process.env.GOOGLE_CREDENTIALS_JSON, 'utf8');
      // Override whatever GOOGLE_APPLICATION_CREDENTIALS was set to (e.g. a Windows path)
      process.env.GOOGLE_APPLICATION_CREDENTIALS = tmpKeyPath;
    } else if (
      process.env.GOOGLE_APPLICATION_CREDENTIALS &&
      !fs.existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS)
    ) {
      // The env var points to a non-existent file (e.g. a hardcoded Windows path).
      // Clear it so the SDK doesn't crash trying to lstat a bad path.
      delete process.env.GOOGLE_APPLICATION_CREDENTIALS;
      throw new Error(
        'Google credentials are not configured. ' +
        'Please set the GOOGLE_CREDENTIALS_JSON environment variable in your Vercel project settings ' +
        'with the full contents of your service account JSON file.'
      );
    }

    // Initialize the Google Gen AI SDK for Vertex AI
    const ai = new GoogleGenAI({
      project,
      location,
      vertexai: true,
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
