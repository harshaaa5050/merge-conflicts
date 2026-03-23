'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Heart, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react'

const lifeStages = [
  { id: 'student', label: 'Student', description: 'Navigating academic life' },
  { id: 'early-career', label: 'Early Career', description: 'Building my professional path' },
  { id: 'new-mom', label: 'New Mom', description: 'Embracing motherhood' },
  { id: 'working-mom', label: 'Working Mom', description: 'Balancing career and family' },
  { id: 'perimenopause', label: 'Perimenopause', description: 'Transitioning through change' },
  { id: 'menopause', label: 'Menopause', description: 'Embracing a new chapter' },
  { id: 'caregiver', label: 'Caregiver', description: 'Supporting loved ones' },
  { id: 'other', label: 'Other', description: 'My own unique journey' },
]

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [selectedStage, setSelectedStage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleComplete = async () => {
    if (!selectedStage) return
    
    setIsLoading(true)
    const supabase = createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/login')
      return
    }

    await supabase
      .from('profiles')
      .update({ 
        life_stage: selectedStage,
        onboarding_complete: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    router.push('/dashboard')
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-gradient-to-b from-primary/5 to-background p-6">
      <div className="w-full max-w-2xl">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-2 text-primary">
            <Heart className="h-8 w-8 fill-current" />
            <span className="font-serif text-2xl font-medium">MatriAI</span>
          </div>

          {step === 1 && (
            <Card className="w-full shadow-lg border-0">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="font-serif text-2xl">Welcome to MatriAI</CardTitle>
                <CardDescription className="text-base max-w-md mx-auto">
                  Your personal AI companion for mental wellness, designed specifically for women at every stage of life.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4 text-center">
                  <div className="grid gap-3 text-left max-w-md mx-auto">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-sm font-medium text-primary">1</span>
                      </div>
                      <div>
                        <p className="font-medium">Daily Check-ins</p>
                        <p className="text-sm text-muted-foreground">Track your mood, energy, and sleep patterns</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-sm font-medium text-primary">2</span>
                      </div>
                      <div>
                        <p className="font-medium">AI Support</p>
                        <p className="text-sm text-muted-foreground">Chat with Matri, your empathetic AI companion</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-sm font-medium text-primary">3</span>
                      </div>
                      <div>
                        <p className="font-medium">Community & Care</p>
                        <p className="text-sm text-muted-foreground">Connect with others and find professional support</p>
                      </div>
                    </div>
                  </div>
                  <Button onClick={() => setStep(2)} className="mt-4 gap-2">
                    Get Started <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card className="w-full shadow-lg border-0">
              <CardHeader className="text-center pb-2">
                <CardTitle className="font-serif text-2xl">{"What stage of life are you in?"}</CardTitle>
                <CardDescription className="text-base">
                  This helps us personalize your experience
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 gap-3">
                  {lifeStages.map((stage) => (
                    <button
                      key={stage.id}
                      onClick={() => setSelectedStage(stage.id)}
                      className={`p-4 rounded-xl text-left transition-all border-2 ${
                        selectedStage === stage.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50 hover:bg-secondary/50'
                      }`}
                    >
                      <p className="font-medium">{stage.label}</p>
                      <p className="text-sm text-muted-foreground">{stage.description}</p>
                    </button>
                  ))}
                </div>
                <div className="flex gap-3 mt-6">
                  <Button variant="outline" onClick={() => setStep(1)} className="gap-2">
                    <ArrowLeft className="h-4 w-4" /> Back
                  </Button>
                  <Button 
                    onClick={handleComplete} 
                    className="flex-1 gap-2"
                    disabled={!selectedStage || isLoading}
                  >
                    {isLoading ? 'Setting up...' : 'Continue to Dashboard'}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-2">
            <div className={`h-2 w-8 rounded-full transition-colors ${step >= 1 ? 'bg-primary' : 'bg-border'}`} />
            <div className={`h-2 w-8 rounded-full transition-colors ${step >= 2 ? 'bg-primary' : 'bg-border'}`} />
          </div>
        </div>
      </div>
    </div>
  )
}
