import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AppHeader } from '@/components/app-header'
import { DashboardContent } from '@/components/dashboard-content'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile?.onboarding_complete) {
    redirect('/onboarding')
  }

  const { data: recentCheckins } = await supabase
    .from('checkins')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(7)

  const today = new Date().toDateString()
  const todayCheckin = recentCheckins?.find(
    (c) => new Date(c.created_at).toDateString() === today
  )

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <DashboardContent 
        profile={profile}
        recentCheckins={recentCheckins || []}
        hasCheckedInToday={!!todayCheckin}
      />
    </div>
  )
}
