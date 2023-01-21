<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import Cookies from 'js-cookie';
	import Loading_page from '$lib/Loading_page.svelte';
	import Alert from '$lib/Alert.svelte';

	/** @type {import('./$types').PageData} */
	export let data;

	const authenticated = data.authenticated;

	let msgAlert = '';
	let openAlert = false;
	let alert_type = '';
	let setTime = '';
	let timeAlert = 3000;

	onMount(async () => {
		if (authenticated === false) {
			if (data.error) {
				openAlert = true;
				msgAlert = data.error;
				alert_type = 'danger';
				clearTimeout(setTime);
				setTime = setTimeout(async () => {
					openAlert = false;
					msgAlert = '';
					Cookies.set('token', '');
					await goto('/login');
				}, timeAlert);
				return;
			}
			await goto('/login');
		}
	});
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

{#if !authenticated}
	<Loading_page />
	<Alert msg={msgAlert} {openAlert} {alert_type} />
{/if}
{#if authenticated}
	<main class="page">
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
			<h3>
				Hello <strong> {data.first_name} </strong> Successfully done, wait... we are redirected to you!
			</h3>
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
		text-align: center;

		& h3 {
			font-size: var(--fs-h3);
		}
	}
</style>
