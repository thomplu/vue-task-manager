<template>
    <div class="popup__overlay">
        <div class="popup__form-container">
            <form class="popup__form">
                <div class="popup__close">
                    <button type="button" class="popup__close-btn" @click="emit('close', false)">X</button>
                </div>
                <h2>Add task</h2>
                <div>
                    <label class="popup__label" for="title">Title</label>
                    <input id="title" type="text" v-model="taskDataFields.title"/>
                </div>
                <div>
                    <label class="popup__label" for="description">description</label>
                    <input id="description" type="text" v-model="taskDataFields.description"/>
                </div>
                <div>
                    <label class="popup__label" for="duration">duration</label>
                    <input id="duration" type="text" v-model="taskDataFields.duration"/>
                </div>
                <div>
                    <label class="popup__label" for="priority">priority</label>
                    <input id="priority" type="text" v-model="taskDataFields.priority"/>
                </div>
                <div class="popup__errors" v-if="error">
                    {{ error }}
                </div>
                <div>Loading: {{loading}}</div>
                <div class="error">
                    <div v-if="error">Error:{{error}}</div>
                </div>
                <div><button type="button" :disabled="loading" @click="saveTask">Create</button></div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useStore } from '@/store';
import { computed, ref, defineProps, defineEmits, reactive } from 'vue';
import { ApiError, TaskData, TaskItem } from '@/types/type';
import { api } from '@/services/ApiService';


const props = defineProps<{
    loading: boolean
    editTaskItem?: TaskItem
}>()
const emit = defineEmits(['close', 'saved', 'update:loading'])
const store = useStore()
const tasks = computed(() => store.state.items)
const error = ref('')

const taskDataFields = reactive({
    title: props.editTaskItem?.title ?? '',
    description: props.editTaskItem?.description ?? '',
    duration: props.editTaskItem?.duration ?? '',
    priority: props.editTaskItem?.prio ?? '',
    complted: props.editTaskItem?.completed ?? false,
})

function validateInput(): boolean {
    if(!taskDataFields.title) {
        error.value = 'No title'
        return false
    }
    if(!taskDataFields.duration) {
        error.value = 'No duration'
        return false
    }
    if(isNaN(Number(taskDataFields.duration))){
        error.value = 'Duration is not a number'
        return false
    }
    if(isNaN(Number(taskDataFields.priority))){
        error.value = 'Priority is not a number'
        return false
    }
    return true;
}

async function saveTask() {
    emit('update:loading', true)
    if(!validateInput()) return
    const taskData: TaskData = {
        title: taskDataFields.title,
        description: taskDataFields.description,
        duration: Number(taskDataFields.duration),
        prio: Number(taskDataFields.priority),
        completed: false,
    }

    try {
        if (!props.editTaskItem) {
            await api.createTask(taskData)
        } else {
            await api.editTask(props.editTaskItem!.id, taskData)
        }
        emit('saved')
    } catch(e) {
        emit('update:loading', false)
        const apiError = e as ApiError
        error.value = `${apiError.code}: ${apiError.message}`
    }
}

</script>

<style scoped lang="scss">
.popup-enter-active,
.popup-leave-active {
    transition: opacity 0.5s ease;
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
