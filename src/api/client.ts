import { getBitlyAPIURL } from "../lib/helpers"

export const getAccessToken = async (code: string) => {
    const bitlyAPIUrl = getBitlyAPIURL()

    let form = {
        'client_id': process.env.EXPO_PUBLIC_CLIENT_ID ?? "",
        'client_secret': process.env.EXPO_PUBLIC_CLIENT_SECRET ?? "",
        'code': code,
        'redirect_uri': process.env.EXPO_PUBLIC_REDIRECT_URI ?? "",
    }

    const formBody = Object.entries(form).map(([key, value]) => encodeURIComponent(key) + '=' + encodeURIComponent(value)).join('&')
    console.log("requestURI: ", `${bitlyAPIUrl}/oauth/access_token`)
    console.log("FORM body: ", formBody)
    let data
    try {
        const response = await fetch(`${bitlyAPIUrl}/oauth/access_token`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formBody
        })
        data = await response.json();
        console.log("DATA: ", data)
        if (response.ok) {
            return data
        }
    } catch (err) {
        return Promise.reject(data)
    }
}