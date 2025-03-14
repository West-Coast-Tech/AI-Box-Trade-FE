// src/middleware/authMiddleware.ts
import { Middleware } from 'redux';
import { logoutSuccess } from '../redux/features/auth/authSlice';
import { MiddlewareAPI } from 'redux';
import isTokenExpired from '../utils/tokenUtils';

const authMiddleware: Middleware = (storeApi: MiddlewareAPI) => {
    return (next) => (action: any) => {
        if (action.type.startsWith('/users')) {
            /// Assuming your API calls start with 'api/call'

            const token = storeApi.getState().auth.token;
            if (isTokenExpired(token)) {
                // Token is expired, dispatch logoutSuccess
                (storeApi as any).dispatch(logoutSuccess());
            }
        }
        return next(action);
    };
};

export default authMiddleware;
