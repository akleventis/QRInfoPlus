import { CLIENT_ID, CLIENT_SECRET } from '../config/secrets';


export const getAccessToken = async (code: string) => {
    let form = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET, // TODO: store this more securely?
        'code': code,
        'redirect_uri': 'exp://127.0.0.1:19000/',
    }

    const formBody = Object.entries(form).map(([key, value]) => encodeURIComponent(key) + '=' + encodeURIComponent(value)).join('&')

    let data
    try {
        const response = await fetch('https://api-ssl.bitly.com/oauth/access_token', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formBody
        })
        data = await response.json();
        if (response.ok) {
            return data
        }
    } catch (err) {
        return Promise.reject(data)
    }
}