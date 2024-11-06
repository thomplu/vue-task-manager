<template>
    <div class="popup__overlay">
        <form class="popup__form">
            <div class="popup__header">
                <h2 class="popup__heading">Add task</h2>
                <div class="popup__close">
                    <div class="popup__close-btn" @click="emit('close', false)"></div>
                </div>
            </div>
            <div class="popup__entry">
                <label class="popup__label" for="title">Title</label>
                <input id="title" type="text" v-model="taskDataFields.title"/>
            </div>
            <div class="popup__entry">
                <label class="popup__label" for="description">description</label>
                <textarea id="description" v-model="taskDataFields.description"/>
            </div>
            <div class="popup__entry">
                <label class="popup__label" for="duration">duration</label>
                <input id="duration" type="text" v-model="taskDataFields.duration"/>
            </div>
            <div class="popup__entry">
                <label class="popup__label" for="priority">priority</label>
                <input id="priority" type="text" v-model="taskDataFields.priority"/>
            </div>
            <div class="popup__errors" v-if="error">
                {{ error }}
            </div>
            <div class="error">
                <div v-if="error">Error:{{error}}</div>
            </div>
            <div class="popup__controls">
                <button v-if="!!editTaskItem" class="popup__btn button button--is-delete" type="button" @click="emit('delete', editTaskItem.id)">Delete Task</button>
                <button class="popup__btn button" type="button" :disabled="loading" @click="saveTask">Save</button>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { useStore } from '@/store';
import { computed, ref, defineProps, defineEmits, reactive } from 'vue';
import { TaskData, TaskItem } from '@/types/type';


const props = defineProps<{
    loading: boolean
    editTaskItem?: TaskItem
}>()
const emit = defineEmits(['close', 'save', 'delete'])
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

function saveTask() {
    if(!validateInput()) return
    const taskData: TaskData = {
        title: taskDataFields.title,
        description: taskDataFields.description ?? undefined,
        duration: Number(taskDataFields.duration),
        prio: Number(taskDataFields.priority),
        completed: false,
    }
    emit('save', taskData)
}

</script>

<style scoped lang="scss">
.popup-enter-active,
.popup-leave-active {
    transition: opacity 0.5s ease;
}

.popup {

    &__btn {
        width: 100%;
        margin-bottom: px-to-rem(10);
        &:last-child {
            margin-bottom: 0;
        }
    }

    &__header {
        display: flex;
        justify-content: space-between;
        margin-bottom: px-to-rem(16);
    }

    &__heading {
        margin: 0;
    }

    &__close {
        display: flex;
        justify-content: center;
        align-items: center;
        width: px-to-rem(34);
        height: px-to-rem(34);

        &:hover {
            cursor: pointer;
        }
    }

    &__close-btn {
        width: 18px;
        height: 18px;
        position: relative;

        &:before, &:after {
            position: absolute;
            content: '';
            background: var(--text-color);
            transform-origin: center;
            transform: rotate(45deg);
        }
        &:before{
            height: px-to-rem(4);
            width: px-to-rem(18);
            left: 0;
            top: 50%;
            margin-top: px-to-rem(-2);
            border-radius: px-to-rem(4);
        }
        &:after {
            width: px-to-rem(4);
            height: px-to-rem(18);
            top: 0;
            left: 50%;
            margin-left: px-to-rem(-2);
            border-radius: px-to-rem(4);
        }
    }

    &__entry {
        margin-bottom: px-to-rem(10);

        input, textarea {
            width: 100%;
        }

        textarea {
            field-sizing: normal;
        }
    }

    &__overlay {
        position: fixed;
        display: flex;
        align-items: center;
        justify-content: center;
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
        padding: px-to-rem(20);
    }


    &__form {
        background: #fff;
        width: px-to-rem(360);
        max-width: calc(100vw - #{px-to-rem(calc(#{$pagePadding} * 2))});
        padding: px-to-rem(20);
        border-radius: px-to-rem(5);
    }

    &__label {
        display: block;
        margin-bottom: px-to-rem(3);
    }

    &__controls {
        margin-top: px-to-rem(15);
    }
}
</style>
