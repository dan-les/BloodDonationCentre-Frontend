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
                    console.log(response.data.message)
                    if (response.data.message === "User successfully register!") {
                        response.data.message = 'Użytkownik pomyślnie zarejestrowany!';
                        return Promise.resolve(response.data);
                    } else {
                        Promise.reject("Błąd podczas rejestracji");
                    }
                },
                error => {
                    commit('registerFailure');
                    if (error.response.data.message === "Error: Username is already taken!") {
                        error.response.data.message = 'Użytkownik o takim loginie już istnieje!';
                    } else if (error.response.data.message === "Error: Email is already in use!") {
                        error.response.data.message = "Użytkownik z takim e-mailem już istnieje!";
                    } else if (error.response.data.message === "Error: Role is not found.") {
                        error.response.data.message = 'Błędne uprawnienia nowego użytkownika!';
                    }
                    return Promise.reject(error);
                }
            );
        },
        refreshToken({commit}, accessToken) {
            commit('refreshToken', accessToken);
        }
    },
    mutations: {
        loginSuccess(state, user) {
            state.status.loggedIn = true;
            state.user = user;
        },
        loginFailure(state) {
            state.status.loggedIn = false;
            state.user = null;
        },
        logout(state) {
            state.status.loggedIn = false;
            state.user = null;
        },
        registerSuccess(state) {
            state.status.loggedIn = false;
        },
        registerFailure(state) {
            state.status.loggedIn = false;
        },
        refreshToken(state, accessToken) {
            state.status.loggedIn = true;
            state.user = {...state.user, accessToken: accessToken};
        }
    }
};
