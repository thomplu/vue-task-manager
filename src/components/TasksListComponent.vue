<template>
    <h2>Your tasks</h2>
    <div class="tasks">
        <ul class="tasks__list">
            <li class="item" v-for="(task, index) in tasks" :key="`task-${task.id}${index}`">
                <span class="item__data item__data--is-title">{{ task.title }}</span>
                <span class="item__data">{{ task.description }}</span>
                <span class="item__data">{{ task.duration }}</span>
                <span class="item__data">{{ task.priority }}</span>
            </li>
        </ul>
    </div>

</template>

<script setup lang="ts">
import { useStore } from '@/store';
import { computed, onMounted, reactive, ref, defineProps } from 'vue';
import { api } from '@/services/ApiService';
import { NewTaskItem, TaskItem } from '@/store/state';

const store = useStore();
const props = defineProps<{
    tasks: TaskItem[]
}>()
const credentials = reactive({
    username: '',
    password: '',
})
const error = ref('')

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
}
.item {
    list-style: none;
    border-bottom: 1px solid black;
    padding: 10px 0;
    &__data {
        display: block;

        &--is-title {
            font-weight: bold;
            margin-bottom: 5px;
        }
    }
}
.form {
    &__label {
        display: block;
    }
}
</style>
