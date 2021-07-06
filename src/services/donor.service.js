import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/donor/';

class DonorService {
    getAllDonors() {
        return axios.get(API_URL + 'list', {headers: authHeader()});
    }
}

export default new DonorService();
