<template>
  <div class="home">
      <div>Is Loading: {{ loading }}</div>
      <TasksListComponent :tasks="tasks" @edit="(id) => triggerEditTask(id)" @deleted="() => loadTasks()" v-model:loading="loading"/>
      <button @click="showTaskFrom = !showTaskFrom">Add task</button>
      <AddTaskComponent v-if="showTaskFrom" @close="showTaskFrom = false" @saved="taskSaved" :key="taskFormKey" v-model:loading="loading" :editTaskItem="editTaskItem"/>
      <LoadingComponent v-if="loading"/>
  </div>
</template>

<script setup lang="ts">
    import TasksListComponent from '@/components/TasksListComponent.vue';
    import AddTaskComponent from '@/components/AddTaskComponent.vue';
    import { computed, nextTick, onBeforeMount, ref } from 'vue';
    import { api } from '@/services/ApiService';
    import { TaskItem } from '@/store/state';
    import LoadingComponent from '@/components/LoadingComponent.vue';

    const showTaskFrom = ref(false)
    const tasks = ref<TaskItem[]>([])
    const error = ref('')
    const loading = ref(false)
    const isEdit = ref(false)
    const editTaskItem = ref<TaskItem | undefined>(undefined)

    async function taskSaved() {
        editTaskItem.value = undefined
        await loadTasks()
        showTaskFrom.value = false
    }
    const taskFormKey = computed(() => editTaskItem.value ? `edit-${editTaskItem.value.id}` : 'add');

    async function loadTasks() {
        loading.value = true
        try {
            tasks.value = await api.fetchTasks()
            console.log('loaded tasks task.value', tasks.value)
            loading.value = false
        } catch (e: any) {
            error.value = e.message;
            console.log('An error occured:', e.message);
        } finally {
            loading.value = false
        }
    }

    async function triggerEditTask(taskId: number) {
        editTaskItem.value = tasks.value.find((task) => task.id === taskId)
        console.log('editTaskItem.value', JSON.stringify(editTaskItem.value))
        showTaskFrom.value = true
    }

    onBeforeMount(() => {
        loadTasks()
    })

</script>

<style scoped lang="scss">
    .popup-enter-from,
    .popup-leave-to {
        opacity: 0;
    }
    .home {
        &__loading {

        }
    }
</style>