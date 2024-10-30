import { State, TaskItem } from '@/store/state';
import { GetterTree } from 'vuex';

export type Getters = {
    getUncompletedTasks(state: State): TaskItem[]
    getCompletedTasks(state: State): TaskItem[]
}

export const getters: GetterTree<State, State> & Getters = {
    getUncompletedTasks(state) {
        return state.items.filter((item) => !item.completed)
    },
    getCompletedTasks(state) {
        return state.items.filter((item) => item.completed)
    }
}