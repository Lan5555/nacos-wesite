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


    public async send(endpoint: string, data: Record<string, any>): Future {
        try {
        const response = await fetch(`${this.BASE_URL}/${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
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
            const response = await fetch(`${this.BASE_URL}/${endpoint}`);
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
                headers: {
                    "Content-Type": "application/json"
                },
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
                method: "DELETE"
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
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            return result;
        } catch (error) {
            console.log(error);
        }
        return { success: false, message: "An error occurred" };
    }
}

export default CoreService;

