import { TaskData, TaskItem } from '@/types/type';
import { ApiError } from '@/types/type';
import router from '@/router';

class ApiService {
    public accessToken = ''
    private static async request<T>(url: string, options: RequestInit): Promise<T> {
        const response = await fetch(url, options);

        if (!response.ok) {
            if (response.status === 403) {
                await router.push({name: 'Login'})
            }
            throw await ApiService.handleError(response);
        }

        if (response.status !== 204 && response.headers.get("Content-Length") !== "0") {
            const data = await response.json();
            return data as T;
        }
        return undefined as unknown as T;
    }

    private static async handleError(res: Response): Promise<ApiError> {
        if (res.status) {
            return {
                code: res.status,
                message: res.statusText
            }
        }
        return {
            code: null,
            message: "An unknow error occured!"
        }
    }

    constructor() {
        this.accessToken = localStorage.getItem('token') ?? ''
    }
    public async getTasks(): Promise<TaskItem[]> {
        return await fetch('/initialtasks.json').then((res) => {
            if (!res.ok) {
                throw new Error(res.statusText)
            }
            return res.json() as Promise<TaskItem[]>
        }).catch((e) => {
            throw new Error(e)
        })
    }

    public async fetchTasks(): Promise<TaskItem[]> {
        return ApiService.request<Promise<TaskItem[]>>('https://railway-planner-backend-production.up.railway.app/tasks', {
            method: "GET", // *GET, POST, PUT, DELETE, etc.
            headers: this.getHeaders(),
        })
    }

    public async login(data: Record<string, string>): Promise<{accessToken: string, username: string}> {
        const resData = await ApiService.request<Promise<{accessToken: string, username: string}>>('https://railway-planner-backend-production.up.railway.app/login', {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            headers: this.getHeaders(),
            body: JSON.stringify(data), // body data type must match "Content-Type" header
        })
        this.accessToken = resData.accessToken
        localStorage.setItem('token', this.accessToken)
        return resData
    }

    public async register(data: Record<string, string>): Promise<{ username: string }> {
        return ApiService.request<{username: string}>('https://railway-planner-backend-production.up.railway.app/register', {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            headers: this.getHeaders(),
            body: JSON.stringify(data), // body data type must match "Content-Type" header
        })
    }

    public async createTask(task: TaskData): Promise<{ task: TaskItem }> {
        return ApiService.request<Promise<{task: TaskItem}>>('https://railway-planner-backend-production.up.railway.app/tasks', {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            headers: this.getHeaders(),
            body: JSON.stringify({task: task}), // body data type must match "Content-Type" header
        })
    }
    public async deleteTask(taskId: number): Promise<void> {
        return ApiService.request<Promise<void>>(`https://railway-planner-backend-production.up.railway.app/tasks/${taskId}`, {
            method: "DELETE", // *GET, POST, PUT, DELETE, etc.
            headers: this.getHeaders(),
        })
    }

    public async editTask(id: number, taskData: TaskData): Promise<{ task: TaskItem }> {
        return ApiService.request<Promise<{ task: TaskItem }>>(`https://railway-planner-backend-production.up.railway.app/tasks/${id}`, {
            method: "PUT", // *GET, POST, PUT, DELETE, etc.
            headers: this.getHeaders(),
            body: JSON.stringify({task: taskData})
        })
    }

    private getHeaders() {
        const headers: Record<string, string> = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            "Access-Control-Allow-Methods" : "POST, GET, OPTIONS, DELETE"
        }
        if (this.accessToken) headers['Authorization'] = `Bearer ${this.accessToken}`
        return headers
    }
}

export const api = new ApiService();