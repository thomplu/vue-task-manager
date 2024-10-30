<template>
  <div class="home">
      <div>Is Loading: {{ loading }}</div>
      <TasksListComponent :tasks="tasks"/>
      <button @click="showNewTaskFrom = !showNewTaskFrom">Add task</button>
      <AddTaskComponent v-model:open="showNewTaskFrom" @created="taskCreated" v-model:loading="loading"/>
  </div>
</template>

<script setup lang="ts">
    import TasksListComponent from '@/components/TasksListComponent.vue';
    import AddTaskComponent from '@/components/AddTaskComponent.vue';
    import { onMounted, ref } from 'vue';
    import { api } from '@/services/ApiService';
    import { TaskItem } from '@/store/state';

    const showNewTaskFrom = ref(false)
    const tasks = ref<TaskItem[]>([])
    const error = ref('')
    const loading = ref(false)

    async function taskCreated() {
        await loadTasks()
        showNewTaskFrom.value = false
    }

    async function loadTasks() {
        loading.value = true
        try {
            tasks.value = await api.fetchTasks()
            console.log('task.value', tasks.value)
            console.log('tasks.value stringified', JSON.stringify(tasks.value))
            loading.value = false
        } catch (e: any) {
            error.value = e.message;
            console.log('An error occured:', e.message);
        } finally {
            loading.value = false
        }
    }

    onMounted(() => {
        loadTasks()
    })

</script>
