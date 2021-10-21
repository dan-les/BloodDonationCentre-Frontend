import api from "./api";

const API_URL = 'donor/';

class DonorService {
    getAllDonors() {
        return api.get(API_URL);
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
