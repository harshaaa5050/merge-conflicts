'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

const moodOptions = [
  { value: 1, label: 'Very Low', color: 'bg-red-100 hover:bg-red-200 border-red-300' },
  { value: 2, label: 'Low', color: 'bg-orange-100 hover:bg-orange-200 border-orange-300' },
  { value: 3, label: 'Okay', color: 'bg-yellow-100 hover:bg-yellow-200 border-yellow-300' },
  { value: 4, label: 'Good', color: 'bg-lime-100 hover:bg-lime-200 border-lime-300' },
  { value: 5, label: 'Great', color: 'bg-green-100 hover:bg-green-200 border-green-300' },
]

const energyOptions = [
  { value: 1, label: 'Exhausted' },
  { value: 2, label: 'Tired' },
  { value: 3, label: 'Moderate' },
  { value: 4, label: 'Energized' },
  { value: 5, label: 'Very High' },
]

const sleepOptions = [
  { value: 1, label: 'Very Poor' },
  { value: 2, label: 'Poor' },
  { value: 3, label: 'Fair' },
  { value: 4, label: 'Good' },
  { value: 5, label: 'Excellent' },
]

interface MoodCheckinProps {
  onComplete?: () => void
}

export function MoodCheckin({ onComplete }: MoodCheckinProps) {
  const [mood, setMood] = useState<number | null>(null)
  const [energy, setEnergy] = useState<number | null>(null)
  const [sleep, setSleep] = useState<number | null>(null)
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!mood) return
    
    setIsSubmitting(true)
    const supabase = createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('checkins').insert({
      user_id: user.id,
      mood,
      energy,
      sleep_quality: sleep,
      notes: notes || null,
    })

    setSubmitted(true)
    setIsSubmitting(false)
    onComplete?.()
  }

  if (submitted) {
    return (
      <Card className="border-0 shadow-md">
        <CardContent className="pt-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="font-serif text-lg font-medium">Check-in Complete</h3>
          <p className="text-sm text-muted-foreground mt-1">Thank you for taking a moment for yourself today.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle className="font-serif">Daily Check-in</CardTitle>
        <CardDescription>How are you feeling today?</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label>Mood</Label>
          <div className="flex gap-2">
            {moodOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setMood(option.value)}
                className={`flex-1 py-3 px-2 rounded-lg text-xs font-medium border-2 transition-all ${
                  mood === option.value
                    ? `bg-primary/10 border-current ring-2 ring-offset-2 ring-primary/20`
                    : `bg-secondary/50 border-transparent hover:bg-secondary`
                } `}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label>Energy Level</Label>
          <div className="flex gap-2">
            {energyOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setEnergy(option.value)}
                className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium border-2 transition-all ${
                  energy === option.value
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'bg-secondary/50 border-transparent hover:bg-secondary'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label>Sleep Quality</Label>
          <div className="flex gap-2">
            {sleepOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSleep(option.value)}
                className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium border-2 transition-all ${
                  sleep === option.value
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'bg-secondary/50 border-transparent hover:bg-secondary'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="notes">Notes (optional)</Label>
          <Textarea
            id="notes"
            placeholder="Anything on your mind today?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>

        <Button 
          onClick={handleSubmit} 
          className="w-full"
          disabled={!mood || isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Complete Check-in'}
        </Button>
      </CardContent>
    </Card>
  )
}
