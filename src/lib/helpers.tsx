export const getBitlyAPIURL = () => {
    return (process.env.EXPO_PUBLIC_ENV === "staging") ? `https://api-ssl.bitly.net` : `https://api-ssl.bitly.com`
}

export const getBitlyV4Url = () => {
    return (process.env.EXPO_PUBLIC_ENV === "staging") ? `https://api-ssl.bitly.net/v4` : `https://api-ssl.bitly.com/v4`
}

export const getBitlyURL = () => {
    return (process.env.EXPO_PUBLIC_ENV === "staging") ? `https://bitly.net` : `https://bitly.com`
}
