<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>

<script setup lang="ts">
    import { api } from '@/services/ApiService';

    async function login() {
        await api.login({username: "thommy", password: "thommy"})
        console.log("logged in!")
    }
</script>
