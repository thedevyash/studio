'use server';

/**
 * @fileOverview Provides AI-generated audio stories based on habit progress.
 *
 * - generateHabitStory - A function to generate a personalized audio story.
 * - GenerateHabitStoryInput - The input type for the function.
 * - GenerateHabitStoryOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import wav from 'wav';
import { googleAI } from '@genkit-ai/googleai';

const GenerateHabitStoryInputSchema = z.object({
  userName: z.string().describe("The user's name."),
  habitName: z.string().describe('The name of the habit.'),
  streak: z.number().describe('The current streak for the habit.'),
});
export type GenerateHabitStoryInput = z.infer<typeof GenerateHabitStoryInputSchema>;

const GenerateHabitStoryOutputSchema = z.object({
  audioUrl: z
    .string()
    .describe(
      "The generated audio story as a data URI. Expected format: 'data:audio/wav;base64,<encoded_data>'."
    ),
  storyText: z.string().describe('The text content of the generated story.'),
});
export type GenerateHabitStoryOutput = z.infer<
  typeof GenerateHabitStoryOutputSchema
>;

export async function generateHabitStory(
  input: GenerateHabitStoryInput
): Promise<GenerateHabitStoryOutput> {
  return generateHabitStoryFlow(input);
}

const storyPrompt = ai.definePrompt({
  name: 'generateHabitStoryPrompt',
  input: { schema: GenerateHabitStoryInputSchema },
  output: { schema: z.object({ story: z.string().describe('A short, encouraging story, about 3-4 sentences long.') }) },
  prompt: `You are a master storyteller who writes uplifting and slightly whimsical tales. 
  
  A user named {{userName}} is building a habit of "{{habitName}}". They have successfully completed it for {{streak}} days in a row!
  
  Write a short, positive, and encouraging story (about 3-4 sentences) that celebrates this achievement. The story should be metaphorical and inspiring. Do not directly mention the habit or the user's name. Instead, use it as inspiration. For example, if the habit is "running", you could write a story about a lone star streaking across the galaxy.`,
});

const generateHabitStoryFlow = ai.defineFlow(
  {
    name: 'generateHabitStoryFlow',
    inputSchema: GenerateHabitStoryInputSchema,
    outputSchema: GenerateHabitStoryOutputSchema,
  },
  async (input) => {
    // 1. Generate the story text
    const { output } = await storyPrompt(input);
    const storyText = output?.story;

    if (!storyText) {
      throw new Error('Failed to generate story text.');
    }

    // 2. Convert the story text to speech
    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
        },
      },
      prompt: storyText,
    });

    if (!media?.url) {
      throw new Error('TTS generation failed. The model did not return audio data.');
    }

    // 3. Convert PCM audio data to WAV format
    const pcmData = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    const wavData = await toWav(pcmData);
    const audioUrl = 'data:audio/wav;base64,' + wavData;

    return {
      audioUrl,
      storyText,
    };
  }
);

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}
