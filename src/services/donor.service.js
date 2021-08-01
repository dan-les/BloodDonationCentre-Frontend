import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/donor/';

class DonorService {
    getAllDonors() {
        return axios.get(API_URL + 'list', {headers: authHeader()});
    }

    getDonorById(id) {
        return axios.get(API_URL + `${id}`, {headers: authHeader()});
    }

    putDonor(id, data) {
        return axios.put(API_URL + `${id}`, data, {headers: authHeader()});
    }

    deleteDonor(id) {
        return axios.delete(API_URL + `${id}`, {headers: authHeader()});
    }
}

export default new DonorService();
