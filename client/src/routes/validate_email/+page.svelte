<script>
  import {onMount} from "svelte";
  import Loading from "$lib/Loading.svelte";
  import Alert from "$lib/Alert.svelte";
  import axios from 'axios';
  import {api_uri} from "../../stores.js";
  import {goto} from "$app/navigation";

  let msgAlert = ''
  let openAlert = false
  let alert_type = ''
  let setTime = ''
  const timeAlert = 3000
  let isLoading = true
  let message = 'Verifying...'
  onMount(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    axios.post(`${api_uri}/user/validate`, {
      token
    })
      .then((response) => {
        isLoading = false
        openAlert = true
        msgAlert = response.data.message
        message = response.data.message
        alert_type = 'success'
        clearTimeout(setTime)
        setTime = setTimeout(async () => {
          openAlert = false
          msgAlert = ''
          await goto('/')
        }, timeAlert)
      })
      .catch((error) => {
        isLoading = false
        openAlert = true
        msgAlert = error.response.data.message
        message = error.response.data.message
        alert_type = 'danger'
        clearTimeout(setTime)
        setTime = setTimeout(() => {
          openAlert = false
          msgAlert = ''
        }, timeAlert)
      })
  })
</script>
<main class="page">
  <Alert msg={msgAlert} {openAlert} {alert_type}/>
  <div class="card">
    <svg class="logo" width="100" height="100" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="150" height="150" rx="50" fill="#FFD603"/>
      <path d="M75 39V114M75 39H60M75 39H90M75 114H90M75 114H60" stroke="black" stroke-width="4" stroke-linecap="round"
            stroke-linejoin="round"/>
    </svg>
    <h3 class="fs-h3">Ideve Core</h3>
    <h3>{ message }</h3>
    <Loading isLoading={isLoading}/>
  </div>
</main>

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

    & h3 {
      font-size: var(--fs-h3);
    }
  }
</style>

