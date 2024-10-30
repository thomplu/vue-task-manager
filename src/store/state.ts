export interface TaskItem {
    id: number,
    title: string,
    description?: string,
    priority?: number,
    duration: number,
    completed?: boolean,
}

export type NewTaskItem = Omit<TaskItem, 'id'>

export type State = {
    items: TaskItem[],
}

export const state = {
    items: [],
};