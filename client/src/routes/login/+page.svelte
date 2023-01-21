<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import Cookies from 'js-cookie';
	import axios from 'axios';
	import { api_uri } from '../../stores.js';
	import Loading from '$lib/Loading.svelte';
	import Loading_page from '$lib/Loading_page.svelte';
	import Alert from '$lib/Alert.svelte';

	/** @type {import('./$types').PageData} */
	export let data;

	let msgAlert = '';
	let openAlert = false;
	let alert_type = '';
	let setTime = '';
	let timeAlert = 3000;
	let isLoading = false;
	let email = '';
	let password = '';

	onMount(async () => {
		if (data.authenticated === true) {
			goto('/');
		}
	});

	const navigate_to = async (path) => {
		await goto(path);
	};

	const login = () => {
		isLoading = true;
		axios
			.post(`${api_uri}/user/login`, {
				email,
				password
			})
			.then((response) => {
				Cookies.set('token', response.data.token, {
					expires: 30
				});
				isLoading = false;
				openAlert = true;
				msgAlert = response.data.message;
				alert_type = 'success';
				clearTimeout(setTime);
				setTime = setTimeout(async () => {
					openAlert = false;
					msgAlert = '';
					await goto('/');
				}, timeAlert);
			})
			.catch((error) => {
				if (error.response.status === 401) {
					isLoading = false;
					openAlert = true;
					msgAlert = error.response.data.message;
					alert_type = 'warning';
					clearTimeout(setTime);
					setTime = setTimeout(() => {
						openAlert = false;
						msgAlert = '';
					}, timeAlert);
					return;
				}
				isLoading = false;
				openAlert = true;
				msgAlert = error.response.data.message;
				alert_type = 'danger';
				clearTimeout(setTime);
				setTime = setTimeout(() => {
					openAlert = false;
					msgAlert = '';
				}, timeAlert);
			});
	};
</script>

<svelte:head>
	<title>Login</title>
</svelte:head>

{#if data.authenticated}
	<Loading_page />
	<Alert msg={msgAlert} {openAlert} {alert_type} />
{/if}
{#if !data.authenticated}
	<main class="page">
		<Alert msg={msgAlert} {openAlert} {alert_type} />
		<div class="card">
			<svg
				class="logo"
				width="100"
				height="100"
				viewBox="0 0 150 150"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<rect width="150" height="150" rx="50" fill="#FFD603" />
				<path
					d="M75 39V114M75 39H60M75 39H90M75 114H90M75 114H60"
					stroke="black"
					stroke-width="4"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
			<h3 class="fs-h3">Ideve Core</h3>
			<div class="controls">
				<button class="btn active fs-body ripple" on:click={() => navigate_to('/login')}>
					<p>Login</p>
				</button>
				<button class="btn fs-body ripple yellow-rp" on:click={() => navigate_to('/register')}>
					<p>Register</p>
				</button>
			</div>
			<div class="form">
				<input bind:value={email} type="text" class="input fs-body" placeholder="email..." />
				<input
					bind:value={password}
					type="password"
					class="input fs-body"
					placeholder="password..."
				/>
				<button class="btn fs-body white-rp ripple" on:click={() => login()} disabled={isLoading}>
					<p>Login</p>
					<Loading {isLoading} />
				</button>
			</div>
		</div>
	</main>
{/if}

<style lang="scss">
	.page {
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}

	.card {
		width: 100%;
		height: max-content;
		max-width: 400px;
		min-height: 200px;
		max-height: 100%;
		background-color: rgb(var(--white-color));
		border-radius: var(--border-radius);
		padding: var(--padding);
		margin: var(--padding);
		color: rgb(var(--text-color));
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		gap: var(--padding);
		& .form {
			width: 90%;
			height: max-content;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			border-radius: var(--border-radius);
			gap: var(--padding);
			& .input {
				padding: var(--padding);
				height: 45px;
				width: 100%;
				border: none;
				border-radius: var(--border-radius);
				background-color: rgb(var(--secondary-color));
				outline: none;
				color: rgb(var(--text-color));
				//color: rgb(0, 0, 0);
				&::placeholder {
					color: rgb(var(--placeholder-color));
					opacity: 1;
				}

				&:-ms-input-placeholder {
					color: rgb(var(--placeholder-color));
				}

				&::-ms-input-placeholder {
					color: rgb(var(--placeholder-color));
				}
			}
			& .btn {
				padding: var(--padding);
				height: 45px;
				width: 100%;
				border-radius: var(--border-radius);
				background-color: rgb(var(--primary-color));
				color: rgb(255, 255, 255);
			}
		}
	}
</style>
