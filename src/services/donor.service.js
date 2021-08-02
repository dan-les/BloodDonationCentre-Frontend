import api from "./api";

const API_URL = 'http://localhost:8080/api/donor/';

class DonorService {
    getAllDonors() {
        return api.get(API_URL + 'list');
    }

    getDonorById(id) {
        return api.get(API_URL + `${id}`);
    }

    putDonor(id, data) {
        return api.put(API_URL + `${id}`, data);
    }

    deleteDonor(id) {
        return api.delete(API_URL + `${id}`);
    }
}

export default new DonorService();
