import TokenService from "./token.service";
import api from "./api";

const API_URL = 'auth/';

class AuthService {
    login(user) {
        return api.post(API_URL + 'signin', {
            username: user.username,
            password: user.password
        })
            .then(response => {
                if (response.data.accessToken) {
                    TokenService.setUser(response.data);
                }
                return response.data;
            });
    }

    logout() {
        TokenService.removeUser();
    }

    register(user) {
        return api.post(API_URL + 'signup', {
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: user.password,
            role: user.role
        });
    }
}

export default new AuthService();
