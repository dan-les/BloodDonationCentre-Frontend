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

    getDonationsStatistics(donationType) {
        return axios.get(API_URL + '/statistics',
            {
                params: {
                    donationType: donationType
                },
                headers: authHeader()
            });
    }

    getDonationsStatisticsByDonor(donorId) {
        return axios.get(API_URL + '/donor/' + `${donorId}` + '/statistics', {headers: authHeader()});
    }

    addNewDonation(data) {
        return axios.post(API_URL, data, {headers: authHeader()});
    }

    getAllDonations(selectedDonationType, selectedIsReleased, selectedBloodGroupWithRh) {
        return axios.get(API_URL + '/list', {
            params: {
                donationType: selectedDonationType,
                isReleased: selectedIsReleased,
                bloodGroupWithRh: selectedBloodGroupWithRh
            },
            headers: authHeader()
        });
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

    patchDonationRecipient(data) {
        return axios.patch(API_URL, data, {headers: authHeader()});
    }
}

export default new DonationService();
