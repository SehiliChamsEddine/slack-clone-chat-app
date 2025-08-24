import axios from "axios";


const MODE = import.meta.env.VITE_MODE;
const API_URL = import.meta.env.VITE_API_URL;


if (!MODE) {
	throw new Error("VITE_MODE is not defined");
}

if (!API_URL) {
	throw new Error("VITE_FRONTEND_URL is not defined");
}

const baseURL = MODE === "development"
	? "http://localhost:5001/api"
	: API_URL;

const axiosInstance = axios.create({
	baseURL: baseURL,
    withCredentials: true
});

export default axiosInstance;