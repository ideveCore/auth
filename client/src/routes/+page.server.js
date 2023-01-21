import axios from 'axios';
import { api_uri } from '../stores.js';
/** @type {import('./$types').PageServerLoad} */
export const load = async ({ cookies }) => {
	const token = cookies.get('token')
	if (!token || token === '') {
		return {
			authenticated: false,
		}
	}
	return axios.post(`${api_uri}/user/validate/token`, {
		token
	})
		.then((response) => {
			if (response.data.authenticated) {
				return {
					authenticated: true,
					first_name: response.data.user.first_name
				}
			}
		})
		.catch(() => {
			return {
				authenticated: false,
				error: 'An unexpected error occurred, please try again!',
			}
		});
};