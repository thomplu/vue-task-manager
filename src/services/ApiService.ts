import { NewTaskItem, TaskItem } from '@/types/type';
import { getters } from '@/store/getters';
import { ApiError } from '@/types/type';

class ApiService {
    public accessToken = ''
    private async request<T>(url: string, options: RequestInit): Promise<T> {
        const response = await fetch(url, options);

        if (!response.ok) {
            // If response status is not OK (200-299), handle error
            throw await this.handleError(response);
        }

        const data = await response.json();
        return data as T;
    }

    private async handleError(res: Response): Promise<ApiError> {
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
        console.log('loaded token:', this.accessToken);
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
        console.log('fetchTasks!!!')
        return this.request<Promise<TaskItem[]>>('https://railway-planner-backend-production.up.railway.app/tasks', {
            method: "GET", // *GET, POST, PUT, DELETE, etc.
            headers: this.getHeaders(),
        })
    }

    public async login(data: Record<string, string>): Promise<{accessToken: string, username: string}> {
        const resData = await this.request<Promise<{accessToken: string, username: string}>>('https://railway-planner-backend-production.up.railway.app/login', {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            headers: this.getHeaders(),
            body: JSON.stringify(data), // body data type must match "Content-Type" header
        })
        this.accessToken = resData.accessToken
        localStorage.setItem('token', this.accessToken)
        return resData
    }

    public async register(data: Record<string, string>): Promise<{username: string}> {
        return this.request<{username: string}>('https://railway-planner-backend-production.up.railway.app/register', {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            headers: this.getHeaders(),
            body: JSON.stringify(data), // body data type must match "Content-Type" header
        })
    }

    public async createTask(task: NewTaskItem): Promise<{task: TaskItem}> {
        return this.request<Promise<{task: TaskItem}>>('https://railway-planner-backend-production.up.railway.app/tasks', {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            headers: this.getHeaders(),
            body: JSON.stringify({task: task}), // body data type must match "Content-Type" header
        })
    }

    private getHeaders() {
        const headers: Record<string, string> = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            "Access-Control-Allow-Methods" : "POST, GET, OPTIONS"
        }
        if (this.accessToken) headers['Authorization'] = `Bearer ${this.accessToken}`
        return headers
    }
}

export const api = new ApiService();