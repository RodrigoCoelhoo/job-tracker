import { supabase } from '../lib/supabase'
import { Interview, InterviewForm } from '../types/interview.types'

export const getInterviewsByApplicationId = async (applicationId: string): Promise<Interview[]> => {
	const { data: interviews, error } = await supabase
		.from('interviews')
		.select('*')
		.eq('application_id', applicationId)
		.order('date', { ascending: true })

	if (error) throw error

	return interviews as Interview[]
}

export const createApplicationInterview = async (applicationId: string, interview: InterviewForm): Promise<Interview> => {
	const { data: createdInterview, error } = await supabase
		.from('interviews')
		.insert({
			application_id: applicationId,
			title: interview.title,
			date: interview.date,
			note: interview.note
		})
		.select()
		.single()

	if (error) throw error

	return createdInterview as Interview
}

export const updateApplicationInterview = async (interviewId: string, interview: InterviewForm): Promise<Interview> => {
	const { data: updatedInterview, error } = await supabase
		.from('interviews')
		.update({
			title: interview.title,
			date: interview.date,
			note: interview.note
		})
		.eq('id', interviewId)
		.select()
		.single()

	if (error) throw error

	return updatedInterview as Interview;
}

export const deleteApplicationInterview = async (interviewId: string): Promise<void> => {
	const { error } = await supabase
		.from('interviews')
		.delete()
		.eq('id', interviewId)

	if (error) throw error
}