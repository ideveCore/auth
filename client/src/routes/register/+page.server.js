/** @type {import('./$types').PageServerLoad} */
export const load = ({ cookies }) => {
	const token = cookies.get('token')
	if (token) {
		return {
			authenticated: true,
		}
	}
	return {
		authenticated: false,
	}
};