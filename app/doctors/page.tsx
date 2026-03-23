import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AppHeader } from '@/components/app-header'
import { DoctorsContent } from '@/components/doctors-content'

export default async function DoctorsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: doctors } = await supabase
    .from('doctors')
    .select('*')
    .order('rating', { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <DoctorsContent doctors={doctors || []} />
    </div>
  )
}
