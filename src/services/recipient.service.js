import api from "./api";

const API_URL = 'http://localhost:8080/api/recipient/';

class RecipientService {
    getAllRecipients() {
        return api.get(API_URL + 'list');
    }

    addNewRecipient(data) {
        return api.post(API_URL, data);
    }
}

export default new RecipientService();
