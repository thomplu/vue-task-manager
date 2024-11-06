<template>
  <div class="tasks">
      <TasksListComponent :tasks="tasks" :title="durationString" @select="triggerEditTask" @add="showTaskFrom = !showTaskFrom"/>
      <AddTaskComponent v-if="showTaskFrom" @close="onTaskFormClose" @save="onSaveTask" @delete="onDeleteTask" :editTaskItem="editTaskItem"/>
      <LoadingComponent v-if="loading"/>
  </div>
</template>

<script setup lang="ts">
    import TasksListComponent from '@/components/TasksListComponent.vue';
    import AddTaskComponent from '@/components/AddTaskComponent.vue';
    import { computed, onBeforeMount, ref } from 'vue';
    import { api } from '@/services/ApiService';
    import { TaskItem } from '@/store/state';
    import LoadingComponent from '@/components/LoadingComponent.vue';
    import { ApiError, TaskData } from '@/types/type';

    const showTaskFrom = ref(false)
    const tasks = ref<TaskItem[]>([])
    // const totalDurationMins = ref<number>(0)
    const error = ref('')
    const loading = ref(false)
    const editTaskItem = ref<TaskItem | undefined>(undefined)

    const durationString = computed(() => {
        const totalDurationMins = tasks.value.reduce((accumulator, task) => accumulator + task.duration, 0)
        const hours = Math.floor(totalDurationMins/60)
        const restMinutes = totalDurationMins % 60
        return `${hours}h, ${restMinutes}min tasks today`
    })

    async function loadTasks() {
        loading.value = true
        try {
            tasks.value = await api.fetchTasks()
            loading.value = false
        } catch (e: any) {
            error.value = e.message;
            console.log('An error occured:', e.message);
        } finally {
            loading.value = false
        }
    }

    async function onDeleteTask(taskId: number) {
        try {
            loading.value = true
            await api.deleteTask(taskId)
            await loadTasks()
        } catch(error) {
            console.error("Error deleting task:", error)
        } finally {
            loading.value = false
            editTaskItem.value = undefined
            showTaskFrom.value = false
        }
    }

    async function onSaveTask(taskData: TaskData) {
        try {
            loading.value = true
            if (!editTaskItem.value) {
                await api.createTask(taskData)
            } else {
                await api.editTask(editTaskItem.value.id, taskData)
            }
            await loadTasks()
        } catch(e) {
            const apiError = e as ApiError
            error.value = `${apiError.code}: ${apiError.message}`
        } finally {
            loading.value = false
            showTaskFrom.value = false
            editTaskItem.value = undefined
        }
    }

    function onTaskFormClose() {
        editTaskItem.value = undefined
        showTaskFrom.value = false
    }

    async function triggerEditTask(taskId: number) {
        editTaskItem.value = tasks.value.find((task) => task.id === taskId)
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
</style>