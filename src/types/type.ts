export interface ApiError {
    message: string; // Error message to display to the user
    code: number | null; // HTTP status code or null if unavailable
}

export interface TaskItem {
    id: number,
    title: string,
    description?: string,
    priority?: number,
    duration: number,
    completed?: boolean,
}

export type NewTaskItem = Omit<TaskItem, 'id'>