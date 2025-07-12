'use server';

/**
 * @fileOverview Provides AI-generated motivational messages and tips based on habit tracking data.
 *
 * - generateMotivation - A function to generate personalized encouragement.
 * - GenerateMotivationInput - The input type for the generateMotivation function.
 * - GenerateMotivationOutput - The return type for the generateMotivation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMotivationInputSchema = z.object({
  habitName: z.string().describe('The name of the habit.'),
  streak: z.number().describe('The current streak for the habit.'),
  longestStreak: z.number().describe('The longest streak for the habit.'),
  completedToday: z.boolean().describe('Whether the habit was completed today.'),
});
export type GenerateMotivationInput = z.infer<typeof GenerateMotivationInputSchema>;

const GenerateMotivationOutputSchema = z.object({
  message: z.string().describe('A personalized motivational message.'),
});
export type GenerateMotivationOutput = z.infer<typeof GenerateMotivationOutputSchema>;

export async function generateMotivation(input: GenerateMotivationInput): Promise<GenerateMotivationOutput> {
  return generateMotivationFlow(input);
}

const generateMotivationPrompt = ai.definePrompt({
  name: 'generateMotivationPrompt',
  input: {schema: GenerateMotivationInputSchema},
  output: {schema: GenerateMotivationOutputSchema},
  prompt: `You are a personal motivation assistant. Your goal is to provide encouraging messages and tips to users based on their habit tracking data.

  Habit Name: {{habitName}}
  Current Streak: {{streak}}
  Longest Streak: {{longestStreak}}
  Completed Today: {{completedToday}}

  Generate a personalized message to encourage the user to continue working towards their goals. The message should be tailored to the user's current progress and whether they completed the habit today.

  If the habit was not completed today, provide specific tips to help the user get back on track.`,
});

const generateMotivationFlow = ai.defineFlow(
  {
    name: 'generateMotivationFlow',
    inputSchema: GenerateMotivationInputSchema,
    outputSchema: GenerateMotivationOutputSchema,
  },
  async input => {
    const {output} = await generateMotivationPrompt(input);
    return output!;
  }
);
