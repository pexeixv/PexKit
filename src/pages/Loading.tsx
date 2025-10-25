import { Skeleton } from '@/components/ui/skeleton'

function Loading() {
  return (
    <div className="min-h-screen flex flex-col space-y-4 p-4">
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-60 w-full" />
    </div>
  )
}

export default Loading
