import axios, { AxiosResponse, AxiosRequestConfig } from "axios";

axios.defaults.baseURL = "/api/app/";
console.log("token",window.token);
let token: string | undefined = window.token;

setInterval(setSessionToken, 3000);

// Declare the window object to include auth_token
declare global {
    interface Window {
        token: string;
        user: unknown;
        roles: unknown;
    }
}
class AxiosClass {


    async get<T>(url: string): Promise<any> {
        console.log("token",window.token);
        if (token === undefined) {
            await setSessionToken();
        }

        const headers = {
            Authorization: `Bearer ${token}`,
        };

        return await axios.get<T>(url, { headers }).catch((err) => {
            console.log("ER2:",err.response.data.message);
        });
    }

    async post<T>(url: string, body?: any): Promise<AxiosResponse<T>> {
        if (token === undefined) {
            await setSessionToken();
        }

        const headers = {
            Authorization: `Bearer ${token}`,
        };

        return  await axios.post<T>(url, body, { headers });
    }
    async put<T>(url: string, body: any): Promise<AxiosResponse<T>> {
        if (token === undefined) {
            await setSessionToken();
        }

        const headers = {
            Authorization: `Bearer ${token}`,
        };

        return  await axios.put<T>(url, body, { headers });
    }

    async delete<T>(url: string): Promise<AxiosResponse<T>> {
        if (token === undefined) {
            await setSessionToken();
        }

        const headers = {
            Authorization: `Bearer ${token}`,
        };

        return await axios.delete<T>(url, { headers });
    }
}

async function setSessionToken() {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export const AxiosService = new AxiosClass();
