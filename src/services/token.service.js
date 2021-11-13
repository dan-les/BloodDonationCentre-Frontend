const USER_KEY = "user";

class JwtTokenService {
    updateLocalAccessToken(token) {
        let user = JSON.parse(localStorage.getItem(USER_KEY));
        user.accessToken = token;
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    getLocalRefreshToken() {
        const user = JSON.parse(localStorage.getItem(USER_KEY));
        if (user)
            return user.refreshToken;
    }

    getLocalAccessToken() {
        const user = JSON.parse(localStorage.getItem(USER_KEY));
        if (user)
            return user.accessToken;
    }

    removeUser() {
        localStorage.removeItem(USER_KEY);
    }

    setUser(user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    getUser() {
        return JSON.parse(localStorage.getItem(USER_KEY));
    }
}

export default new JwtTokenService();
