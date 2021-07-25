import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/reservation/';

class ReservationService {

    getHours(date) {
        return axios.get(API_URL + 'available-hours/list',
            {
                params: {
                    date: date
                },
                headers: authHeader()
            });
    }

    addNewReservation(data) {
        return axios.post(API_URL, data, {headers: authHeader()});
    }

    getAllReservations() {
        return axios.get(API_URL + 'list', {headers: authHeader()});
    }

    getAllReservationsByDonorId(donorId) {
        return axios.get(API_URL + 'list/donor/' + `${donorId}`, {headers: authHeader()});
    }

    getAllReservationsByDate(date) {
        return axios.get(API_URL + 'list',
            {
                params: {
                    date: date,
                },
                headers: authHeader()
            });
    }

    deleteReservation(id) {
        return axios.delete(API_URL + `${id}`, {headers: authHeader()});
    }

    getReservationById(id) {
        return axios.get(API_URL + `${id}`, {headers: authHeader()});
    }
}

export default new ReservationService();
