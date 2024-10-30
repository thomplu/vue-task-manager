import { ActionContext, ActionTree } from 'vuex';
import { State } from '@/store/state';
import { Mutations, MutationType } from '@/store/mutations';

export enum ActionTypes {
    CreateTaskItem = 'CREATE_TASK_ITEM'
}

type ActionAugments = Omit<ActionContext<State, State>, 'commit'> & {
    commit<K extends keyof Mutations>(
        key: K,
        payload: Parameters<Mutations[K]>[1]
    ): ReturnType<Mutations[K]>
}

export type Actions = {
    [ActionTypes.CreateTaskItem](context: ActionAugments): void
}

export const actions: ActionTree<State, State> & Actions = {
    [ActionTypes.CreateTaskItem]({ commit, state }, ) {
        commit(MutationType.CreateItem, {
            title: 'fufu',
            description: 'fufufu',
            duration: 60,
        })
        console.log('is this necessary')
    }
}