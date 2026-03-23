import type { ApplicationForm, Application, ApplicationStats } from "../types/application.types"
import type { Page } from "../types/pagination.types"

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/applications`

export const applicationService = {
	getApplications: async (page: number, limit: number, status?: string): Promise<{ applications: Application[], pagination: Page }> => {
		const params = new URLSearchParams(
			{
				page: page.toString(),
				limit: limit.toString()
			}
		)

		if (status) params.append('status', status)

		const res = await fetch(`${API_URL}?${params.toString()}`, {
			credentials: 'include'
		})

		if (!res.ok) {
			const errorData = await res.json()
			throw new Error(errorData.error || 'Failed to fetch applications')
		}

		const data = await res.json()
		return { applications: data.applications, pagination: data.pagination }
	},

	createApplication: async (data: ApplicationForm): Promise<Application> => {
		const res = await fetch(`${API_URL}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify(data)
		})

		if (!res.ok) {
			const errorData = await res.json()
			throw new Error(errorData.error || 'Failed to create application')
		}

		const response = await res.json()
		return response.application
	},

	updateApplication: async (id: string, data: ApplicationForm): Promise<Application> => {
		const res = await fetch(`${API_URL}/${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify(data)
		})

		if (!res.ok) {
			const errorData = await res.json()
			throw new Error(errorData.error || 'Failed to update application')
		}

		const response = await res.json()
		return response.application
	},

	deleteApplication: async (id: string): Promise<void> => {
		const res = await fetch(`${API_URL}/${id}`, {
			method: 'DELETE',
			credentials: 'include'
		})

		if (!res.ok) {
			throw new Error('Failed to delete application')
		}
	},

	getStats: async (): Promise<ApplicationStats> => {
		const res = await fetch(`${API_URL}/stats`, {
			credentials: 'include'
		})

		if (!res.ok) {
			const { error } = await res.json()
			throw new Error(error || 'Failed to fetch stats')
		}

		const { stats } = await res.json()
		return stats
	},
}