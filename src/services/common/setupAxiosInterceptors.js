import axiosInstance from "../api";
import TokenService from "../token.service";
import DocumentEventService from "./DocumentEventService";

const UNAUTHORIZED = 401;
const FORBIDDEN = 403;
const REFRESH_TOKEN_URL = 'auth/refresh-token';
const LOGOUT_URL = "logout";
const SIGNIN_URL = "/auth/signin";

const setup = (store) => {

    axiosInstance.interceptors.request.use(
        (config) => {
            const token = TokenService.getLocalAccessToken();
            if (token)
                config.headers["Authorization"] = 'Bearer ' + token;
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    axiosInstance.interceptors.response.use(
        (res) => {
            return res;
        },
        async (err) => {
            const receivedConfig = err.config;

            if (receivedConfig.url !== SIGNIN_URL && err.response) {
                if (err.response.status === UNAUTHORIZED && !receivedConfig._retry) { // Access Token - expired
                    receivedConfig._retry = true;
                    try {
                        const response = await axiosInstance.post(REFRESH_TOKEN_URL, {
                            refreshToken: TokenService.getLocalRefreshToken(),
                        });
                        const {accessToken} = response.data;
                        store.dispatch(REFRESH_TOKEN_URL, accessToken);
                        TokenService.updateLocalAccessToken(accessToken);
                        return axiosInstance(receivedConfig);

                    } catch (_error) {
                        return Promise.reject(_error);
                    }
                } else if (err.response && err.response.status === FORBIDDEN) { // Access Forbidden
                    DocumentEventService.dispatch(LOGOUT_URL);
                }
            }
            return Promise.reject(err);
        }
    );
};

export default setup;
