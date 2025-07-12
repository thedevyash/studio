'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2, Volume2, ArrowLeft } from 'lucide-react';
import { generateSpeech } from '@/ai/flows/tts-demo';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function TtsDemoPage() {
  const [text, setText] = useState('Hello from Habit Horizon! This is a demonstration of our new text-to-speech feature.');
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerateSpeech = async () => {
    if (!text.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please enter some text to generate speech.',
      });
      return;
    }
    setLoading(true);
    setAudioUrl(null);
    try {
      const result = await generateSpeech(text);
      setAudioUrl(result.audioUrl);
    } catch (error) {
      console.error('TTS Generation Error:', error);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: 'Could not generate audio. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl py-8 px-4 sm:py-12">
        <div className="mb-6">
            <Button variant="ghost" asChild>
                <Link href="/dashboard">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Link>
            </Button>
      </div>
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-2xl">Text-to-Speech Demo</CardTitle>
          <CardDescription>
            Enter some text below and click the button to generate audio using our AI model.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid w-full gap-2">
            <Label htmlFor="tts-input">Text to Synthesize</Label>
            <Textarea
              id="tts-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type your message here..."
              rows={4}
              className="bg-background/50"
              disabled={loading}
            />
          </div>
          <Button onClick={handleGenerateSpeech} disabled={loading} size="lg" className="w-full sm:w-auto">
            {loading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Volume2 className="mr-2 h-5 w-5" />
            )}
            {loading ? 'Generating...' : 'Generate Speech'}
          </Button>

          {audioUrl && (
            <div className="p-4 bg-secondary rounded-lg">
                <h3 className="font-semibold mb-2">Generated Audio</h3>
                <audio controls autoPlay src={audioUrl} className="w-full">
                    Your browser does not support the audio element.
                </audio>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
