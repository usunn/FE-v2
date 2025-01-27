import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router'

import { AdminSidebar, MainLayout } from '@/components/feature'
import { useMyInfoStore } from '@/store'

export const AdminRoute = () => {
  const navigate = useNavigate()
  const { role } = useMyInfoStore((state) => state.myInfo)

  useEffect(() => {
    if (!(role === 'ROLE_ADMIN')) {
      navigate('/', { replace: true })
    }
  }, [role, navigate])

  if (!role) return null

  return (
    <MainLayout>
      <div className="flex w-full flex-1 justify-center">
        <AdminSidebar />
        <Outlet />
      </div>
    </MainLayout>
  )
}
