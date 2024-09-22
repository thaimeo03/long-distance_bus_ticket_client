import { IProfileResponse, IUpdateRoleBody } from '@/common/interfaces/users.interface'
import api from './api'
import { DataResponse, MessageResponse } from '@/common/interfaces/response.interface'
import { IRevenueInMonthAnalysisResponse, IRevenueInWeekAnalysisResponse } from '@/common/interfaces/admin.interface'

export const getAllUsersInfo = async () => {
  const res = await api.get<DataResponse<IProfileResponse[]>>('/admin/users')
  return res.data
}

export const updateUserRole = async ({ id, body }: { id: string; body: IUpdateRoleBody }) => {
  const res = await api.put<MessageResponse>(`/admin/user/update-role/${id}`, body)
  return res.data
}

export const getRevenueOfCompanyInMonthAnalysis = async (companyId: string) => {
  const res = await api.get<DataResponse<IRevenueInMonthAnalysisResponse[]>>(
    `/admin/report/analyze-company-bus-in-month/${companyId}`
  )
  return res.data
}

export const getRevenueOfCompanyInWeekAnalysis = async (companyId: string) => {
  const res = await api.get<DataResponse<IRevenueInWeekAnalysisResponse[]>>(
    `/admin/report/analyze-company-bus-in-week/${companyId}`
  )
  return res.data
}
