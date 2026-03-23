import type { Interview, InterviewForm } from '../types/interview.types'

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/applications`

export const interviewService = {
	getInterviews: async (applicationId: string): Promise<Interview[]> => {
		const res = await fetch(`${API_URL}/${applicationId}/interviews`, {
			credentials: 'include'
		})

		if (!res.ok) {
			const { error } = await res.json()
			throw new Error(error || 'Failed to fetch interviews')
		}

		const { interviews } = await res.json()
		return interviews
	},

	createInterview: async (applicationId: string, data: InterviewForm): Promise<Interview> => {
		const res = await fetch(`${API_URL}/${applicationId}/interviews`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify(data)
		})

		if (!res.ok) {
			const { error } = await res.json()
			throw new Error(error || 'Failed to create interview')
		}

		const { interview } = await res.json()
		return interview
	},

	updateInterview: async (applicationId: string, interviewId: string, data: InterviewForm): Promise<Interview> => {
		const res = await fetch(`${API_URL}/${applicationId}/interviews/${interviewId}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify(data)
		})

		if (!res.ok) {
			const { error } = await res.json()
			throw new Error(error || 'Failed to update interview')
		}

		const { interview } = await res.json()
		return interview
	},

	deleteInterview: async (applicationId: string, interviewId: string): Promise<void> => {
		const res = await fetch(`${API_URL}/${applicationId}/interviews/${interviewId}`, {
			method: 'DELETE',
			credentials: 'include'
		})

		if (!res.ok) {
			throw new Error('Failed to delete interview')
		}
	}
}