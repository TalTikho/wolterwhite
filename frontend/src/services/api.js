//local env or fallback to relative addressing in docker.
const API_BASE = process.env.REACT_APP_API_BASE_URL || '';
//handle the method and body params.
const buildConfig = (method, jwt=localStorage.getItem("token"), customHeaders = {}, body = null) => {

    //We start by merging our default Content-Type with any custom headers passed in
    const headers = {
        'Content-Type': 'application/json',
        ...customHeaders
    };

    //Add the JWT to the 'headers' object if it exists.

    //check if a user is logged in (jwt == null).
    if (jwt) {
        //Add it to the 'headers' object.
        headers.Authorization = `Bearer ${jwt}`;
    }

    //set the config object to give our fetch methods.
    const config = {
        method: method,
        headers: headers,
    };

    //check that body is not null to treat a defined object.
    if (body) {
        //Check if the body of the request is FormData and treat it accordingly.
        const isFormData = body instanceof FormData;
        if (isFormData) {
            //Remove Content-Type so the browser can set the boundary string
            delete headers['Content-Type'];
            //Attach the raw body
            config.body = body;
        } else {
            //Stringify the JSON text in the body and attach it
            config.body = JSON.stringify(body);
        }
    }

    return config;
};

const buildUrl = (uri, params = {}) => {
    //Create the main URL object using URL to go from relative to 
    //absolute if not using an env.
    //No env on github for security purposes hence this patch.
    const url = new URL(`${API_BASE}${uri}`, window.location.origin);

    //create formated parameters for a query.
    const urlParams = new URLSearchParams(params);

    //Add the parameters to the the url.
    url.search = urlParams.toString();

    //Return the final formatted stringified url.
    return url.toString();
};

//Handle the response because fetch does not 'fetch' errors.
const handleResponse = async (res) => {
    //Check for bad status codes 
    if (!res.ok) {
        //Force a checkout only if not in login page.
        //login page is not protected but should give a 401 
        //for wrong credentials.
        if (res.status === 401 && window.location.pathname !== '/login') {
            //force the user to login page through pure js window.location.href
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        //Read the stream to get the server's error message
        const errorMessage = await res.text();

        //Throw the error, falling back to the status code if the server sent no message
        throw new Error(errorMessage || `HTTP error! Status: ${res.status}`);

    }

    //If the response was ok (200-299), handle a 204 No Content edge case (like a DELETE or PATCH request)
    if (res.status === 204) return null;

    //Otherwise, read the stream and return the clean JSON data
    return res.json();
};


export const sendGet = async (uri, jwt = null, params = {}, customHeaders = {}) => {
    //get the url
    const address = buildUrl(uri, params);
    //set its parameters
    const config = buildConfig("GET", jwt, customHeaders);
    //fetch the response/error
    const response = await fetch(address, config);
    //wait patiently for the response.
    return await handleResponse(response);
}

export const sendPOST = async (uri, body = null, jwt = null, params = {}, customHeaders = {}) => {
    //get the url
    const address = buildUrl(uri, params);
    //set its parameters
    const config = buildConfig("POST", jwt, customHeaders, body);
    //fetch the response/error
    const response = await fetch(address, config);
    //wait patiently for the response.
    return await handleResponse(response);

}

export const sendPATCH = async (uri, body = null, jwt = null, params = {}, customHeaders = {}) => {
    //get the url
    const address = buildUrl(uri, params);
    //set its parameters
    const config = buildConfig("PATCH", jwt, customHeaders, body);
    //fetch the response/error
    const response = await fetch(address, config);
    //wait patiently for the response.
    return await handleResponse(response);

}

export const sendDELETE = async (uri, body = null, jwt = null, params = {}, customHeaders = {}) => {
    //get the url
    const address = buildUrl(uri, params);
    //set its parameters
    const config = buildConfig("DELETE", jwt, customHeaders, body);
    //fetch the response/error
    const response = await fetch(address, config);
    //wait patiently for the response.
    return await handleResponse(response);

}
