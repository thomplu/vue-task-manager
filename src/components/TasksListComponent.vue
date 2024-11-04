<template>
    <h2>Your tasks</h2>
    <div class="tasks">
        <ul class="tasks__list">
            <li class="tasks__item" v-for="(task, index) in tasks" :key="`task-${task.id}${index}`">
                <div class="tasks__data">
                    <span class="item__data item__data--is-title">{{ task.title }}</span>
                    <span class="item__data">{{ task.description }}</span>
                    <span class="item__data">{{ task.duration }}</span>
                    <span class="item__data">{{ task.priority }}</span>
                </div>
                <div class="tasks__edit"><button class="tasks__edit-button" @click="editTask(task.id)">Edit</button></div>
                <div class="tasks__delete"><button class="tasks__delete-button" @click="deleteTask(task.id)">Delete</button>
                </div>
            </li>
        </ul>
    </div>

</template>

<script setup lang="ts">
import { useStore } from '@/store';
import { reactive, ref, defineProps, defineEmits } from 'vue';
import { TaskItem } from '@/store/state';
import { api } from '@/services/ApiService';

const store = useStore();
const emit = defineEmits(["edit", "deleted", "update:loading"]);
const props = defineProps<{
    tasks: TaskItem[]
    loading: boolean
}>()
const credentials = reactive({
    username: '',
    password: '',
})
const error = ref('')

async function deleteTask(taskId: number){
    try {
        emit("update:loading", true)
        await api.deleteTask(taskId)
        emit('deleted')
    } catch(error) {
        console.error("Error deleting task:", error)
    } finally {
        emit("update:loading", false)
    }
}
function editTask(taskId: number){
    emit("edit", taskId)
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

.rect {
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.flex {
    display: flex;
}

.red {
    background: red;
}

.blue {
    background: blue;
}


button {
    margin-top: 20px;
}
.tasks {
    &__list {
        padding: 0;
    }
    &__item {
        list-style: none;
        border-bottom: 1px solid black;
        padding: 10px 0;
        display: flex;
        &__data {
            display: block;

            &--is-title {
                font-weight: bold;
                margin-bottom: 5px;
            }
        }
    }
    &__data {
        flex-grow: 1
    }
    &__edit {
        flex-basis: 40px;
        flex-grow:0;
    }
    &__delete {
        flex-basis: 40px;
        flex-grow:0;
    }
}
.form {
    &__label {
        display: block;
    }
}
</style>
