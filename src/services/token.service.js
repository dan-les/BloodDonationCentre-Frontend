class TokenService {
    getLocalRefreshToken() {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            return user.refreshToken;
        }
    }

    getLocalAccessToken() {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            return user.accessToken;
        }

    }

    updateLocalAccessToken(token) {
        let user = JSON.parse(localStorage.getItem("user"));
        user.accessToken = token;
        localStorage.setItem("user", JSON.stringify(user));
    }

    getUser() {
        return JSON.parse(localStorage.getItem("user"));
    }

    setUser(user) {
        console.log(JSON.stringify(user));
        localStorage.setItem("user", JSON.stringify(user));
    }

    removeUser() {
        localStorage.removeItem("user");
    }
}

export default new TokenService();
