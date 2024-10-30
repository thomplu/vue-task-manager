import { MutationTree } from 'vuex'
import { NewTaskItem, State, TaskItem } from '@/store/state';

export enum MutationType {
    CreateItem = 'CREATE_ITEM',
    SetItems = 'SET_ITEMS',
    DeleteItem = 'DELETE_ITEM',
    CompleteItem = 'COMPLETE_ITEM',
}

export type Mutations = {
    [MutationType.CreateItem](state: State, item: NewTaskItem): void
    [MutationType.SetItems](state: State, items: TaskItem[]): void
    [MutationType.DeleteItem](state: State, id: number): void
    [MutationType.CompleteItem](state: State, id: number): void
}

export const mutations: MutationTree<State> & Mutations = {
    [MutationType.CreateItem](state: State, newItem: NewTaskItem) {

        let newId: number | undefined = undefined
        let counter = 0
        while(!newId) {
            const idFound = state.items.find((item) => item.id === counter)
            if (!idFound) {
                newId = counter
            }
            counter++
        }
        state.items.push({id: newId, ...newItem} as TaskItem)
    },
    [MutationType.SetItems](state: State, items: TaskItem[]) {
        state.items = items
    },
    [MutationType.DeleteItem](state: State, id: number) {
        const index = state.items.findIndex((item) => item.id === id)
        if (index === -1) return
        state.items.splice(index, 1)
    },
    [MutationType.CompleteItem](state: State, id: number) {
        const item = state.items.find((item) => item.id === id)
        if (item) item.completed = true
    }
}