<template>
    <div class="tasks">
        <div class="tasks__header">
            <h1 class="tasks__heading">{{ title }}</h1>
            <button class="tasks__add-btn" @click="emit('add')"><span class="tasks__add-btn-icon">&nbsp;</span></button>
        </div>
        <ul class="tasks__list">
            <li class="tasks__item"
                v-for="(task, index) in orderedTasks"
                :key="`task-${task.id}${index}`"
                @click="emit('select', task.id)"
                :style="getHeightStyleByDuration(task.duration)"
                :class="{'tasks__item--is-important': task.prio}"
            >
                <div class="tasks__data">
                    <span class="tasks__title">{{ getTaskTitle(task) }}</span>
                    <span class="tasks__duration">{{ task.duration }} min</span>
                </div>
            </li>
        </ul>
    </div>

</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue';
import { TaskItem } from '@/types/type';

const emit = defineEmits(["select", "add"]);
const props = defineProps<{
    tasks: TaskItem[]
    title: string
}>()

const htmlFontSize = window.getComputedStyle(document.documentElement).fontSize;
const baseFontSize = parseFloat(htmlFontSize); // Convert to a number (in pixels)

const orderedTasks = computed(() =>
    ([...props.tasks].sort((taskA, taskB) => {
        if ((taskA.prio || 0) === (taskB.prio || 0)) {
            return taskA.duration < taskB.duration ? -1 : 1
        }
        //If no prio set or prio 0 it should come last that's why a high value 9999 is set
        return (taskA.prio || 9999) < (taskB.prio || 9999) ? -1 : 1
    })))

function getHeightStyleByDuration(duration: number): string {
    const minHeightStr = 'min-height'
    if (duration <= 15) return `${minHeightStr}: auto`
    return `${minHeightStr}: ${duration * 34 / (15 * baseFontSize)}rem`
}

function getTaskTitle(task: TaskItem): string {
    return `${task.prio ? '!!! ' : ''} ${task.title}`
}

</script>

<style scoped lang="scss">
.tasks {
    background: var(--primary-bg);
    padding: px-to-rem(16);
    border-radius: px-to-rem($borderRadius);

    &__header {
        display: flex;
        justify-content: space-between;
    }

    &__add-btn {
        width: px-to-rem(34);
        height: px-to-rem(34);
        border-radius: 50%;
        background: var(--button-bg);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        padding: 0;
        box-shadow: 0 px-to-rem(1) px-to-rem(12) rgba(0, 0, 0, 0.2);
    }

    &__add-btn-icon {
        width: 18px;
        height: 18px;
        position: relative;
        display: block;

        &:before, &:after {
            background: var(--text-color);
            position: absolute;
            border-radius: px-to-rem(2);
            content: '';
        }

        &:before {
            left: 0;
            top: px-to-rem(7);
            width: px-to-rem(18);
            height: px-to-rem(4);
        }
        &:after {
            height: px-to-rem(18);
            width: px-to-rem(4);
            top: 0;
            left: px-to-rem(7);
        }
    }

    &__heading {
        font-size: px-to-rem(20);
        margin-top: 0;
        line-height: px-to-rem(34);
    }

    &__list {
        padding: 0;
    }

    &__item {
        list-style: none;
        display: flex;
        border-radius: px-to-rem($borderRadius);
        background: #fff;
        box-shadow: 0 px-to-rem(1) px-to-rem(12) rgba(0, 0, 0, 0.2);
        padding: px-to-rem(8) px-to-rem(12);
        margin-bottom: px-to-rem(10);
        font-weight: bold;

        &--is-important {
            background: var(--task-bg-important);
            border: px-to-rem(1) solid var(--task-border-important);
        }

        &:hover {
            cursor: pointer;
            .tasks__edit {
                opacity: 1;
            }
            .tasks__delete {
                opacity: 1;
            }
        }
    }

    &__title {
        display: block;
        font-weight: bold;
        font-size: px-to-rem(15);
        line-height: px-to-rem(18);
    }

    &__data {
        display: flex;
        flex-grow: 1;
        justify-content: space-between;
    }

    &__duration {
        line-height: px-to-rem(18);
        font-size: px-to-rem(10);
        font-weight: 500;
        padding-left: px-to-rem(10);
    }
}
</style>
