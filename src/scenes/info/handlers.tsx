import axios from 'axios'
import { getBitlyV4Url } from '../../lib/helpers'
import { URL } from 'react-native-url-polyfill';
import { Auth } from '../../reducers/authReducer';
import { RouterType } from '../../actions/actionTypes';

const googleDNS = `https://dns.google/resolve`

const bitlyV4Url = getBitlyV4Url()
const bitlyAddresses = [`cname.bitly.com.`, `67.199.248.13`, `67.199.248.12`, `67.199.248.11`, `67.199.248.10`]

enum QRType {
    BITLY_URL = 'Bitly URL',
    CONACT_CARD = 'Contact Card',
    SMS = 'SMS',
    PHONE_NUMBER = 'phone Number',
    EMAIL = 'email',
    WIFI = 'Wifi',
    URL = 'URL',
    TEXT = 'Text',
}


export interface QRInfo {
    // Common fields
    type: string
    raw_decode: string,
    error: string
    cta_link: string,

    // bitlink Fields
    bitlink: string,
    long_url: string,
    created: string,
    
    // if user owned bitlink
    brand_guid: string,

    // email Fields
    email: string,
    subject: string,
    body: string,

    // SMS Fields
    phone: string,

    // MECard Fields
    name: string,
    note: string,

    // WIFI
    authentication: string,
    ssid: string,
    password: string,
}

const handleQRScan = async (rawText: string, auth: Auth, router: string): Promise<QRInfo> => {
    if (router === RouterType.BITLY_V4) {
        return handleBitlyRouter(rawText, auth)
    }
    return handleDefaultRouter(rawText, auth)
}

const handleBitlink = async (link: URL, auth: Auth): Promise<QRInfo> => {
    const bitlink = `${link.host}${link.pathname}`
    let data = {
        type: QRType.BITLY_URL,
        raw_decode: link.toString()
    } as QRInfo

    if (auth.accessToken === '') {
        data.error = 'Connect Bitly account to expand'
        return data
    }
    try {
        const resp = await axios.post(`${bitlyV4Url}/expand`, { 'bitlink_id': bitlink }, {
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${auth.accessToken}`
            }
        });
        const hash = resp.data['id'].split('/')[1]
        data.bitlink = resp.data['link']
        data.created = resp.data['created_at']
        data.long_url = resp.data['long_url']
    } catch (err) {
        data.error = 'There was an error expanding this link'
        if (axios.isAxiosError(err)) {
            data.error = err.message
        }
        return data
    }

    return data
}

const handleMECARD = (rawText: string) => {
    var data = {
        raw_decode: rawText,
        type: QRType.CONACT_CARD
    } as QRInfo

    var [nameIndex, telIndex, mailIndex, noteIndex] = [rawText.indexOf(':N:'), rawText.indexOf(';TEL:'), rawText.indexOf(';EMAIL:'), rawText.indexOf(';NOTE:')]
    if (nameIndex > 0) {
        let name = rawText.substring(nameIndex + 3, rawText.indexOf(';'))
        data.name = name
    }
    if (telIndex > 0) {
        let tel = rawText.substring(telIndex + 5, rawText.indexOf(';', telIndex + 5))
        data.phone = tel
    }
    if (mailIndex > 0) {
        let mail = rawText.substring(mailIndex + 7, rawText.indexOf(';', mailIndex + 7))
        data.email = mail
    }
    if (noteIndex > 0) {
        let note = rawText.substring(noteIndex + 6, rawText.indexOf(';', noteIndex + 6))
        data.note = note
    }
    return data
}

const handleSMS = (rawText: string) => {
    var data = {
        raw_decode: rawText,
        type: QRType.SMS,
    } as QRInfo

    var a = rawText.split(':', 3)
    if (a[1] !== '') data.phone = a[1]
    if (a[2] !== '') data.body = a[2]
    return data
}

const handleTel = (rawText: string) => {
    var data = {
        raw_decode: rawText,
        type: QRType.PHONE_NUMBER,
        phone: rawText.split(':')[1]
    } as QRInfo
    return data
}

const handleEmail = (rawText: string) => {
    var data = {
        raw_decode: rawText,
        type: QRType.EMAIL,
    } as QRInfo

    var [mailIndex, subIndex, bodyIndex] = [rawText.indexOf('mailto:'), rawText.indexOf('?subject='), rawText.indexOf('body=')]

    const email = rawText.substring(mailIndex + 7, rawText.indexOf('?'))
    data.email = email

    const subject = rawText.substring(subIndex + 9, rawText.indexOf('&', subIndex + 8))
    if (subject.length > 0) data.subject = decodeURI(subject)

    const body = rawText.substring(bodyIndex + 5)
    if (body.length > 0) data.body = decodeURI(body)

    return data
}

const handleWIFI = (rawText: string) => {
    var data = {
        raw_decode: rawText,
        type: QRType.WIFI,
    } as QRInfo

    var [authIndex, sIndex, pIndex] = [rawText.indexOf(':T:'), rawText.indexOf('S:'), rawText.indexOf(';P:')]
    if (authIndex > 0) {
        const auth = rawText.substring(authIndex + 3, sIndex - 1)
        data.authentication = auth
    }
    if (sIndex > 0) {
        const ssid = rawText.substring(sIndex + 2, rawText.indexOf(';', sIndex + 2))
        data.ssid = ssid
    }
    if (pIndex > 0) {
        const password = rawText.substring(pIndex + 3, rawText.indexOf(';', pIndex + 3))
        data.password = password
    }
    return data
}

// Handles [Bitlinks, URL's, MeCard, phone Number, SMS, email, WiFi, Text]
// All other types ei [vCard, Event, SEPA, ...etc] will display as raw text
const handleDefaultRouter = async (rawText: string, auth: Auth): Promise<QRInfo> => {
    if (rawText.startsWith('http')) {
      const x = new URL(rawText);
      const response = await axios.get(`${googleDNS}?name=${x.hostname}`);
      
      for (const obj of response.data['Answer']) {
        if (bitlyAddresses.includes(obj['data'])) {
          return handleBitlink(x, auth);
        }
      }
      
      return { raw_decode: rawText, type: QRType.URL } as QRInfo;
    }

    const lowercaseLink = rawText.toLowerCase();
    if (lowercaseLink.startsWith('mecard')) return handleMECARD(rawText);
    if (lowercaseLink.startsWith('tel')) return handleTel(rawText);
    if (lowercaseLink.startsWith('smsto')) return handleSMS(rawText);
    if (lowercaseLink.startsWith('mailto')) return handleEmail(rawText);
    if (lowercaseLink.startsWith('wifi')) return handleWIFI(rawText);
  
    return { raw_decode: rawText, type: QRType.TEXT } as QRInfo;
  };

  const handleBitlyRouter = async (rawText: string, auth: Auth): Promise<QRInfo> => {
    let data = {} as QRInfo
    try {
        const resp = await axios.post(`${bitlyV4Url}/qrcodes/decode`, { 'raw_text': rawText }, {
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${auth.accessToken}`
            }
        });
        console.log(resp.data)
        data = resp.data;
        return data;
    } catch (err) {
        data.error = 'There was an error decoding this qr code'

        if (axios.isAxiosError(err)) {
            data.error = err.message;
        }

        return data;
    }
};
export default handleQRScan