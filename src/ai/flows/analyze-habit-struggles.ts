'use server';

/**
 * @fileOverview Provides AI-driven analysis of habit performance to offer adjustments and nudges.
 *
 * - analyzeHabitStruggles - A function to generate adaptive suggestions for habits.
 * - AnalyzeHabitStrugglesInput - The input type for the function.
 * - AnalyzeHabitStrugglesOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeHabitStrugglesInputSchema = z.object({
  habitName: z.string().describe('The name of the habit.'),
  habitDescription: z.string().describe('The description of the habit.'),
  missedDays: z.number().describe('The number of consecutive days the user has missed this habit.'),
});
export type AnalyzeHabitStrugglesInput = z.infer<typeof AnalyzeHabitStrugglesInputSchema>;

const AnalyzeHabitStrugglesOutputSchema = z.object({
    suggestion: z.string().describe("A personalized, adaptive suggestion to help the user get back on track. This can be a micro-habit scaling suggestion (e.g., 'try a shorter 5-minute session'), a schedule adjustment, or a behavioral nudge based on psychological principles like 'tiny habits'.")
});
export type AnalyzeHabitStrugglesOutput = z.infer<typeof AnalyzeHabitStrugglesOutputSchema>;

export async function analyzeHabitStruggles(input: AnalyzeHabitStrugglesInput): Promise<AnalyzeHabitStrugglesOutput> {
  return analyzeHabitStrugglesFlow(input);
}

const analysisPrompt = ai.definePrompt({
  name: 'analyzeHabitStrugglesPrompt',
  input: {schema: AnalyzeHabitStrugglesInputSchema},
  output: {schema: AnalyzeHabitStrugglesOutputSchema},
  prompt: `You are an intelligent personal habit coach. Your goal is to help users who are struggling with their habits by providing insightful, adaptive suggestions.

  The user is having trouble with the following habit:
  - Habit Name: {{habitName}}
  - Description: {{habitDescription}}
  - Consecutive Missed Days: {{missedDays}}

  Based on this, you need to generate a single, actionable suggestion to help them. Your suggestion should be based on established behavioral psychology principles.

  Here are your options for the type of suggestion:
  1.  **Micro-Habit Scaling:** Suggest making the habit easier to start. For example, if the habit is "Read for 30 minutes," suggest "Read for just 5 minutes."
  2.  **Schedule Adjustment:** Suggest a different time of day that might be easier. For example, "Perhaps try this in the evening instead of the morning?"
  3.  **Behavioral Nudge:** Offer a psychological tip. For example, "Focus on just showing up. The smallest step forward is a victory."

  Analyze the information and provide the most appropriate and encouraging suggestion. Frame it as a helpful observation, not a criticism. Start your suggestion with a phrase like "I noticed..." or "It looks like...".
  `,
});

const analyzeHabitStrugglesFlow = ai.defineFlow(
  {
    name: 'analyzeHabitStrugglesFlow',
    inputSchema: AnalyzeHabitStrugglesInputSchema,
    outputSchema: AnalyzeHabitStrugglesOutputSchema,
  },
  async (input) => {
    const {output} = await analysisPrompt(input);
    return output!;
  }
);
