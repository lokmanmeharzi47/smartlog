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

    // Initialize the Google Gen AI SDK
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
Vous êtes une intelligence artificielle experte en logistique et gestion d'entrepôt (WMS) pour le système "SmartLog" (développé par une startup algérienne).
Votre rôle est d'expliquer une recommandation stratégique spécifique à l'utilisateur.

Règles de gestion SmartLog :
- WMA (Weighted Moving Average) : Les prédictions utilisent un historique de 7 jours avec des poids de 1 à 7.
- Rupture imminente : Si Jours Restants < 7. Calcul: Jours = plancher(Stock / WMA journalier).
- Anomalie Z-Score : Z = |x - μ| / σ. > 1.5 est une anomalie, > 2.5 est critique.
- ABC Pareto : A (0-70% valeur, contrôle strict), B (70-90%), C (90-100%, commande en lot).
- EOQ (Formule de Wilson) : Optimise la quantité à commander (minimise coût commande + coût stockage).

Voici le contexte du produit pour cette recommandation :
${JSON.stringify(context, null, 2)}

Fournissez une explication claire, stratégique et détaillée en FRANÇAIS.
Incluez obligatoirement :
1. Pourquoi cette recommandation a été déclenchée (en vous basant sur les données de stock, d'anomalie, de WMA ou EOQ).
2. Les risques potentiels ou les coûts cachés (logistiques, pertes de CA) si cette action n'est pas effectuée.
3. Une action immédiate recommandée (ex: "Déclencher un bon de commande de X unités", "Vérifier la saisie", "Liquider le stock C").

Formatez votre réponse en Markdown propre, utilisez des puces ou du texte en gras pour la lisibilité. Gardez un ton très professionnel, concis, digne d'un consultant en supply chain. N'affichez rien d'autre que l'explication.
`;

    // Use gemini-1.5-flash for speed and context capabilities
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
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
