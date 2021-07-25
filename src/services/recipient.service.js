import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/recipient/';

class RecipientService {
    getAllRecipients() {
        return axios.get(API_URL + 'list', {headers: authHeader()});
    }

    // getDonorById(id) {
    //     return axios.get(API_URL + `${id}`, {headers: authHeader()});
    // }

    // addDonor(data) {
    //     return axios.post(API_URL, data, {headers: authHeader()});
    // }
    addNewRecipient(data) {
        return axios.post(API_URL, data, {headers: authHeader()});
    }
}

export default new RecipientService();
