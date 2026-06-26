import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from './apiConfig';

const buildConfig = (method: string, jwt?: string | null, customHeaders = {}, body: any = null) => {
    const headers: any = {
        'Content-Type': 'application/json',
        ...customHeaders
    };

    if (jwt) {
        headers.Authorization = `Bearer ${jwt}`;
    }

    const config: any = {
        method: method,
        headers: headers,
    };

    if (body) {
        if (body instanceof FormData) {
            delete headers['Content-Type'];
            config.body = body;
        } else {
            config.body = JSON.stringify(body);
        }
    }

    return config;
};

const buildUrl = (uri: string, params: Record<string, any> = {}) => {
    const url = `${API_BASE_URL}${uri}`;
    
    const queryString = Object.keys(params)
        .map(key => key + '=' + params[key])
        .join('&');
        
    return queryString ? `${url}?${queryString}` : url;
};

const handleResponse = async (res: Response) => {
    if (!res.ok) {
        if (res.status === 401) {
             await AsyncStorage.removeItem('token');
             throw new Error('Unauthorized'); 
        }
        
        const errorMessage = await res.text();
        throw new Error(errorMessage || `HTTP error! Status: ${res.status}`);
    }

    if (res.status === 204) return null;

    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("image")) {
        return await res.blob();
    }

    return res.json();
};

export const sendGet = async (uri: string, jwt?: string | null, params = {}, customHeaders = {}) => {
    const address = buildUrl(uri, params);
    const config = buildConfig("GET", jwt, customHeaders);
    const response = await fetch(address, config);
    return await handleResponse(response);
}

export const sendPOST = async (uri: string, body: any = null, jwt?: string | null, params = {}, customHeaders = {}) => {
    const address = buildUrl(uri, params);
    const config = buildConfig("POST", jwt, customHeaders, body);
    const response = await fetch(address, config);
    return await handleResponse(response);
}

export const sendPATCH = async (uri: string, body: any = null, jwt?: string | null, params = {}, customHeaders = {}) => {
    const address = buildUrl(uri, params);
    const config = buildConfig("PATCH", jwt, customHeaders, body);
    const response = await fetch(address, config);
    return await handleResponse(response);
}

export const sendDELETE = async (uri: string, body: any = null, jwt?: string | null, params = {}, customHeaders = {}) => {
    const address = buildUrl(uri, params);
    const config = buildConfig("DELETE", jwt, customHeaders, body);
    const response = await fetch(address, config);
    return await handleResponse(response);
}