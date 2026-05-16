type Future = Promise<Net>;
type Net = {
    success: boolean;
    message: string;
    data?: any;
}

class CoreService {
    private BASE_URL: string = "https://nacos-backend-y0vl.onrender.com";

    setBaseUrl(url: string) {
        this.BASE_URL = url;
    }

    private getToken(): string | null {
    return localStorage.getItem('token');
}

private setAuthHeader(headers: HeadersInit = {}) {
    const token = this.getToken();

    if (token) {
        return {
            ...headers,
            Authorization: `Bearer ${token}`,
        };
    }

    return headers;
}


    public async send(endpoint: string, data: Record<string, any>): Future {
        const token = this.getToken();
        
        try {
        const response = await fetch(`${this.BASE_URL}/${endpoint}`, {
            method: "POST",
            headers: this.setAuthHeader({
                "Content-Type": "application/json"
            }),
            body: JSON.stringify(data)
        });

        const result = await response.json();
        return result;
        } catch (error) {
            console.log(error);
        }
        return { success: false, message: "An error occurred" };
    }

    public async get(endpoint: string): Future {
        try {
            const response = await fetch(`${this.BASE_URL}/${endpoint}`,{
                headers: this.setAuthHeader()
            });
            const result = await response.json();
            return result;
        } catch (error) {
            console.log(error);
        }
        return { success: false, message: "An error occurred" };
    }
    public async put(endpoint: string, data: Record<string, any>): Future {
        try {
            const response = await fetch(`${this.BASE_URL}/${endpoint}`, {
                method: "PUT",
                headers:this.setAuthHeader({
                "Content-Type": "application/json"
            }),
                body: JSON.stringify(data)
            });
            const result = await response.json();
            return result;
        } catch (error) {
            console.log(error);
        }
        return { success: false, message: "An error occurred" };
    }
    public async delete(endpoint: string): Future {
        try {
            const response = await fetch(`${this.BASE_URL}/${endpoint}`, {
                method: "DELETE",
                headers:this.setAuthHeader()
            });
            const result = await response.json();
            return result;
        } catch (error) {
            console.log(error);
        }
        return { success: false, message: "An error occurred" };
    }
    public async patch(endpoint: string, data: Record<string, any>): Future {
        try {
            const response = await fetch(`${this.BASE_URL}/${endpoint}`, {
                method: "PATCH",
                headers: this.setAuthHeader({
                "Content-Type": "application/json"
                 }),
                body: JSON.stringify(data)
            });
            const result = await response.json();
            return result;
        } catch (error) {
            console.log(error);
        }
        return { success: false, message: "An error occurred" };
    }

    private objectToFormData(
    data: Record<string, any>
): FormData {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
        if (value instanceof File) {
            formData.append(key, value);
        } else if (value instanceof Blob) {
            formData.append(key, value);
        } else if (Array.isArray(value)) {
            value.forEach((item) => {
                formData.append(key, item);
            });
        } else if (
            value !== null &&
            value !== undefined
        ) {
            formData.append(key, String(value));
        }
    });

    return formData;
}

public async upload(
    endpoint: string,
    data: Record<string, any>,
    method: string = "POST"
): Future {
    try {
        const formData =
            this.objectToFormData(data);

        const response = await fetch(
            `${this.BASE_URL}/${endpoint}`,
            {
                method: method,
                body: formData,
                headers:this.setAuthHeader({
                "Content-Type": "application/json"
            })
            }
        );

        const result = await response.json();
        return result;
    } catch (error) {
        console.log(error);
    }

    return {
        success: false,
        message: "An error occurred",
    };
}

}

export default CoreService;

