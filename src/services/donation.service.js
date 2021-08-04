import api from "./api";

const API_URL = 'donation/';

class DonationService {

    getSoonestPossibleDateForNextDonation(donationType, donorId) {
        return api.get(API_URL + 'next',
            {
                params: {
                    donationType: donationType,
                    donorId: donorId
                }
            });
    }

    getDonationsStatistics(donationType) {
        return api.get(API_URL + 'statistics',
            {
                params: {
                    donationType: donationType
                }
            });
    }

    getDonationsStatisticsByDonor(donorId) {
        return api.get(API_URL + 'donor/' + `${donorId}` + '/statistics');
    }

    addNewDonation(data) {
        return api.post(API_URL, data);
    }

    getAllDonations(selectedDonationType, selectedIsReleased, selectedBloodGroupWithRh) {
        return api.get(API_URL + 'list', {
            params: {
                donationType: selectedDonationType,
                isReleased: selectedIsReleased,
                bloodGroupWithRh: selectedBloodGroupWithRh
            }
        });
    }

    getAllDonationsByDonorId(donorId) {
        return api.get(API_URL + 'list',
            {
                params: {
                    donorId: donorId,
                }
            });
    }

    patchDonationRecipient(data) {
        return api.patch(API_URL, data);
    }
}

export default new DonationService();
