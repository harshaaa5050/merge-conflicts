import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AppHeader } from '@/components/app-header'
import { CommunityContent } from '@/components/community-content'

export default async function CommunityPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: threads } = await supabase
    .from('threads')
    .select(`
      *,
      comments:comments(count)
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <CommunityContent threads={threads || []} userId={user.id} />
    </div>
  )
}
