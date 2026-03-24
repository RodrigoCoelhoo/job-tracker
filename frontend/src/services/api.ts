import toast from 'react-hot-toast';

export async function apiFetch(input: RequestInfo, init?: RequestInit) {
	const res = await fetch(input, {
		credentials: 'include',
		...init,
	});

	if (res.status === 429) {
		toast.error("Too many requests. Some data may be incomplete — please wait a moment and try again.");
	}

	return res;
}