'use server';

/**
 * @fileOverview Provides AI-driven avatar generation.
 *
 * - generateAvatar - A function to generate a unique user avatar.
 * - GenerateAvatarInput - The input type for the function.
 * - GenerateAvatarOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAvatarInputSchema = z.object({
  name: z.string().describe('The name of the user to generate an avatar for.'),
});
export type GenerateAvatarInput = z.infer<typeof GenerateAvatarInputSchema>;

const GenerateAvatarOutputSchema = z.object({
  imageUrl: z
    .string()
    .describe(
      "The generated image as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateAvatarOutput = z.infer<typeof GenerateAvatarOutputSchema>;

export async function generateAvatar(input: GenerateAvatarInput): Promise<GenerateAvatarOutput> {
  return generateAvatarFlow(input);
}

const generateAvatarFlow = ai.defineFlow(
  {
    name: 'generateAvatarFlow',
    inputSchema: GenerateAvatarInputSchema,
    outputSchema: GenerateAvatarOutputSchema,
  },
  async (input) => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `Generate a visually appealing and unique user avatar. The avatar should be an abstract, minimalist, geometric design. Use a calming color palette inspired by sky blue and light slate gray. Do not include any text or letters. The user's name is "${input.name}", use this as a seed for creativity but do not represent the name visually.`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media.url) {
        throw new Error("Image generation failed to return a data URL.");
    }

    return {
      imageUrl: media.url,
    };
  }
);
