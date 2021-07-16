import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/donation';

class DonationService {

    getSoonestPossibleDateForNextDonation(donationType, donorId) {
        return axios.get(API_URL + '/next',
            {
                params: {
                    donationType: donationType,
                    donorId: donorId
                },
                headers: authHeader()
            });
    }

    addNewDonation(data) {
        return axios.post(API_URL, data, {headers: authHeader()});
    }

    getAllDonations() {
        return axios.get(API_URL + '/list', {headers: authHeader()});
    }

    getAllDonationsByDonorId(donorId) {
        return axios.get(API_URL + '/list',
            {
                params: {
                    donorId: donorId,
                },
                headers: authHeader()
            });
    }
}

export default new DonationService();
