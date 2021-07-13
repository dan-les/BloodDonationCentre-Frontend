import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/reservation';

class ReservationService {

    getHours(date) {
        return axios.get(API_URL + '/hours/list',
            {
                params: {
                    date: date
                },
                headers: authHeader()
            });
    }
}

export default new ReservationService();
