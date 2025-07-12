
'use server';
/**
 * @fileOverview A server-side flow to securely find a user by their email address.
 *
 * - findUserByEmail - A function to find a user's profile by their email.
 * - FindUserByEmailInput - The input type for the function.
 * - FindUserByEmailOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getFirestore, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { app } from '@/lib/firebase';

const FindUserByEmailInputSchema = z.object({
  email: z.string().email().describe('The email address of the user to find.'),
});
export type FindUserByEmailInput = z.infer<typeof FindUserByEmailInputSchema>;

const FindUserByEmailOutputSchema = z.object({
  id: z.string().optional().describe("The user's unique ID (UID)."),
  email: z.string().email().optional().describe("The user's email."),
  error: z.string().optional().describe("An error message if the user is not found."),
});
export type FindUserByEmailOutput = z.infer<typeof FindUserByEmailOutputSchema>;


export async function findUserByEmail(input: FindUserByEmailInput): Promise<FindUserByEmailOutput> {
  return findUserByEmailFlow(input);
}


const findUserByEmailFlow = ai.defineFlow(
  {
    name: 'findUserByEmailFlow',
    inputSchema: FindUserByEmailInputSchema,
    outputSchema: FindUserByEmailOutputSchema,
  },
  async ({ email }) => {
    try {
      const db = getFirestore(app);
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email), limit(1));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return { error: 'User not found.' };
      }

      const userDoc = querySnapshot.docs[0];
      return {
        id: userDoc.id,
        email: userDoc.data().email,
      };
    } catch (e: any) {
      console.error('Error in findUserByEmailFlow:', e);
      return { error: 'An error occurred while searching for the user.' };
    }
  }
);
