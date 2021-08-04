import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:8080/api/",
    // baseURL: "http://bdc-backend.cytr.us/api/",
    headers: {
        "Content-Type": "application/json",
    },
});

export default instance;
