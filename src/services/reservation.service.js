import api from "./api";

const API_URL = 'reservation/';

class ReservationService {

    getHoursWithAvailability(date) {
        return api.get(API_URL + 'available-hours/list',
            {
                params: {
                    date: date
                }
            });
    }

    addNewReservation(data) {
        return api.post(API_URL, data);
    }

    getAllReservations() {
        return api.get(API_URL + 'list');
    }

    getAllReservationsByDonorId(donorId) {
        return api.get(API_URL + 'list/donor/' + `${donorId}`);
    }

    getAllReservationsByDate(date) {
        return api.get(API_URL + 'list',
            {
                params: {
                    date: date,
                }
            });
    }

    deleteReservation(id) {
        return api.delete(API_URL + `${id}`);
    }

    getReservationById(id) {
        return api.get(API_URL + `${id}`);
    }
}

export default new ReservationService();
