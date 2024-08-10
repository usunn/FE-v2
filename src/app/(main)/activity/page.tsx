import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query'

import { getSemesters } from '@/service/server/semester'

import { LoadingCurrentSemester } from './_components/LoadingCurrentSemester'
import { SemesterSection } from './_components/SemesterSection'

const ActivityPage = async () => {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['semesters'],
    queryFn: getSemesters,
  })

  return (
    <div className="flex flex-col gap-2">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <SemesterSection />
        <LoadingCurrentSemester />
      </HydrationBoundary>
    </div>
  )
}

export default ActivityPage
