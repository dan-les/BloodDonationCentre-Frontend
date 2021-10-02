import AuthService from '../services/auth.service';

const user = JSON.parse(localStorage.getItem('user'));
const initialState = user
    ? {status: {loggedIn: true}, user}
    : {status: {loggedIn: false}, user: null};

export const auth = {
    namespaced: true,
    state: initialState,
    actions: {
        login({commit}, user) {
            return AuthService.login(user).then(
                user => {
                    commit('loginSuccess', user);
                    return Promise.resolve(user);
                },
                error => {
                    commit('loginFailure');
                    return Promise.reject(error);
                }
            );
        },
        logout({commit}) {
            AuthService.logout();
            commit('logout');
        },
        register({commit}, user) {
            return AuthService.register(user).then(
                response => {
                    commit('registerSuccess');
                    if (response.data.message === "User successfully register!") {
                        response.data.message = 'Użytkownik pomyślnie zarejestrowany!';
                        return Promise.resolve(response.data);
                    }
                },
                error => {
                    commit('registerFailure');
                    if (error.response.data.message === "Username is already taken") {
                        error.response.data.message = 'Użytkownik o takim loginie już istnieje!';
                    } else if (error.response.data.message === "Email is already in use") {
                        error.response.data.message = "Użytkownik z takim e-mailem już istnieje!";
                    } else if (error.response.data.message === "Role is not found") {
                        error.response.data.message = 'Błędne uprawnienia nowego użytkownika!';
                    }
                    Promise.reject("Błąd podczas rejestracji");
                }
            );
        },
        refreshToken({commit}, accessToken) {
            commit('refreshToken', accessToken);
        }
    },
    mutations: {
        registerSuccess(state) {
            state.status.loggedIn = false;
        },
        registerFailure(state) {
            state.status.loggedIn = false;
        },
        logout(state) {
            state.status.loggedIn = false;
            state.user = null;
        },
        loginSuccess(state, user) {
            state.status.loggedIn = true;
            state.user = user;
        },
        loginFailure(state) {
            state.status.loggedIn = false;
            state.user = null;
        },
        refreshToken(state, accessToken) {
            state.status.loggedIn = true;
            state.user = {...state.user, accessToken: accessToken};
        }
    }
};
