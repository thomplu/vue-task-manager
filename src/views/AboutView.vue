<template>
  <div class="about">
    <h1>This is an about page</h1>
      <div>
          <button @click="testget">Test get!</button>
          <button @click="testPost">Test post!</button>
          <div>
              <br/>
              <br/>
          </div>
          <div>
              <button @click="login">Login</button>
          </div>
      </div>
  </div>
</template>

<script setup lang="ts">
    import { api } from '@/services/ApiService';

    async function testget() {
        const res = await api.testGet()
        console.log(`Get result received: ${res.result}`)
    }

    async function testPost() {
        const res = await api.testPost()
        console.log(`Post result received: ${res.result}`)
    }

    async function login() {
        await api.login({username: "thommy", password: "thommy"})
        console.log("logged in!")
    }
</script>
