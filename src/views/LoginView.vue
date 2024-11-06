<template>
    <div>
        <h2>Login</h2>
        <form>
            <div class="form__section">
                <label class="form__label" for="username">Username</label>
                <input id="username" type="text" v-model="credentials.username"/>
            </div>
            <div class="form__section">
                <label class="form__label" for="password">Password</label>
                <input id="password" type="text" v-model="credentials.password"/>
            </div>
            <div class="error">
                <div v-if="error">
                    Error: {{ error }}
                </div>
            </div>
            <div><button class="btn login" type="button" @click="login">Login</button></div>
            <div><button class="btn register" type="button" @click="register">Register</button></div>
        </form>
    </div>
</template>

<script setup lang="ts">
    import { reactive, ref } from 'vue';
    import { TaskItem } from '@/store/state';
    import { api } from '@/services/ApiService';
    import { useRouter } from 'vue-router';
    import { ApiError } from '@/types/type';

    const tasks = ref<TaskItem[]>([])
    const router = useRouter()
    const credentials = reactive({
        username: '',
        password: '',
    })
    const error = ref('')

    async function login() {
        try {
            await api.login({
                username: credentials.username,
                password: credentials.password,
            })
            await router.push({name: 'Tasks'})

        } catch (e: any) {
            error.value = e.message;
            console.log('An error occured:', e.message);
        }
    }

    async function register() {
        try {
            const username = await api.register({
                username: credentials.username,
                password: credentials.password,
            })
            error.value = ""
            window.alert(`Registered user ${username} successfully!`)
        } catch (e) {
            const apiError = e as ApiError
            if (apiError.code === 409) error.value = "User already existing. Try another username";
            if (apiError.code === 400) error.value = "Password not valid. Must be at least 6 characters long";
        }
    }


</script>

<style scoped lang="scss">
    .form {
        &__label {
            display: block;
            margin-bottom: px-to-rem(1);
        }

        &__section {
            margin-bottom: px-to-rem(10);
        }
    }
    .register {
        background: #706f6f;
    }
    .btn {
        margin-bottom: 1rem;
        min-width: px-to-rem(82);
    }
    .error {
        height: px-to-rem(30);
        color: red;
    }
</style>