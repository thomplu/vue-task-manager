<template>
    <Transition name="popup">
        <div v-if="open" class="popup__overlay">
            <div class="popup__form-container">
                <form class="popup__form">
                    <h2>Add task</h2>
                    <div>
                        <label class="popup__label" for="title">Title</label>
                        <input id="title" type="text" v-model="newTask.title"/>
                    </div>
                    <div>
                        <label class="popup__label" for="description">description</label>
                        <input id="description" type="text" v-model="newTask.description"/>
                    </div>
                    <div>
                        <label class="popup__label" for="duration">duration</label>
                        <input id="duration" type="text" v-model="newTask.duration"/>
                    </div>
                    <div>
                        <label class="popup__label" for="priority">priority</label>
                        <input id="priority" type="text" v-model="newTask.priority"/>
                    </div>
                    <div class="popup__errors" v-if="error">
                        {{ error }}
                    </div>
                    <div>Loading: {{loading}}</div>
                    <div class="error">
                        <div v-if="error">Error:{{error}}</div>
                    </div>
                    <div><button type="button" :disabled="loading" @click="createNewTask">Create</button></div>
                </form>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { useStore } from '@/store';
import { computed, ref, defineProps, defineEmits, reactive } from 'vue';
import { ApiError, NewTaskItem } from '@/types/type';
import { api } from '@/services/ApiService';


const props = defineProps<{
    open: boolean
    loading: boolean
}>()
const emit = defineEmits(['update:open', 'created', 'update:loading'])
const store = useStore()
const tasks = computed(() => store.state.items)
const error = ref('')
// const tasks = store.state.items;
console.log('items from store:', tasks)
const newTask = reactive({
    title: '',
    description: '',
    duration: '',
    priority: '',
})


function validateInput(): boolean {
    console.log('validateInput');
    if(!newTask.title) {
        error.value = 'No title'
        return false
    }
    if(!newTask.duration) {
        error.value = 'No duration'
        return false
    }
    console.log('duration number', Number(newTask.duration));
    if(isNaN(Number(newTask.duration))){
        error.value = 'Duration is not a number'
        return false
    }
    if(isNaN(Number(newTask.priority))){
        error.value = 'Priority is not a number'
        return false
    }
    return true;
}

async function createNewTask() {
    emit('update:loading', true)
    if(!validateInput()) return
    const newTaskItem: NewTaskItem = {
        title: newTask.title,
        description: newTask.description,
        duration: Number(newTask.duration),
        priority: Number(newTask.priority),
        completed: false,
    }
    try {
        await api.createTask(newTaskItem)
        emit('created')
    } catch(e) {
        const apiError = e as ApiError
        error.value = `${apiError.code}: ${apiError.message}`
    }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.popup-enter-active,
.popup-leave-active {
    transition: opacity 0.5s ease;
}

.popup-enter-from,
.popup-leave-to {
    opacity: 0;
}
.popup {

    &__overlay {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: rgba(0,0,0,0.5);
    }

    &__form-container {
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
    }


    &__form {
        background: #fff;
        max-width: 960px;
        padding: 20px;
        border-radius: 5px;
    }

    &__label {
        display: block;
    }
}
</style>
