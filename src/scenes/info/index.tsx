
import { StyleSheet, Text, View, Button, Linking } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import axios from 'axios'
import { useTypedSelector } from '../../hooks/useTypeSelector'
import { URL } from 'react-native-url-polyfill';
import { useState } from 'react';
import { useEffect } from 'react';
import { Auth } from '../../reducers/authReducer';

const googleDNS = `https://dns.google/resolve`
const bitlyURL = `https://api-ssl.bitly.com/v4`
const bitlyAddresses = [`cname.bitly.com.`, `67.199.248.13`, `67.199.248.12`]

interface linkInfo {
    text: string,
    data: string
}

const handleBitlink = async (link: URL, auth: Auth): Promise<linkInfo[]> => {
    const bitlink = `${link.host}${link.pathname}`
    if (auth.accessToken === '') {
        return [
            {text: 'Raw Decode:', data: link.toString()},
            {text: 'Type:', data: 'URL'},
            {text: 'Expand:', data: 'Connect Bitly account to expand'}
        ]
    }
    var data
    try {
        const resp = await axios.post(`${bitlyURL}/expand`, { 'bitlink_id': bitlink }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.accessToken}`
            }
        });
        data = [
            { text: 'Raw Decode:', data: link.toString() },
            { text: 'Type:', data: 'URL' },
            { text: 'Created:', data: resp.data['created_at'] },
            { text: 'ID:', data: resp.data['id'] },
            { text: 'Link:', data: link.toString() },
            { text: 'Long url:', data: resp.data['long_url'] }
        ]
    } catch (err) {
        return [{ text: 'handleBitlinkErr', data: `${err}` }]
    }

    return data
}

const handleMECARD = (link: string) => {
    var data = [{ text: 'Raw Decode: ', data: link }, { text: 'Type: ', data: 'Contact Card' }]
    var [nameIndex, telIndex, mailIndex, noteIndex] = [link.indexOf(':N:'), link.indexOf(';TEL:'), link.indexOf(';EMAIL:'), link.indexOf(';NOTE:')]
    if (nameIndex > 0) {
        let name = link.substring(nameIndex + 3, link.indexOf(';'))
        data.push({ text: 'Name:', data: name })
    }
    if (telIndex > 0) {
        let tel = link.substring(telIndex + 5, link.indexOf(';', telIndex + 5))
        data.push({ text: 'Phone:', data: tel })
    }
    if (mailIndex > 0) {
        let mail = link.substring(mailIndex + 7, link.indexOf(';', mailIndex + 7))
        data.push({ text: 'Email:', data: mail })
    }
    if (noteIndex > 0) {
        let note = link.substring(noteIndex + 6, link.indexOf(';', noteIndex + 6))
        data.push({ text: ':', data: note })
    }
    return data
}

const handleSMS = (link: string) => {
    var data = [{ text: 'Raw Decode: ', data: link }, { text: 'Type: ', data: 'Short Message Service' }]
    var a = link.split(':', 3)
    if (a[1] !== '') data.push({ text: 'Number:', data: a[1] })
    if (a[2] !== '') data.push({ text: 'Body:', data: a[2] })
    return data
}

const handleTel = (link: string) => {
    return [{ text: 'Raw Decode:', data: link }, { text: 'Type: ', data: 'Phone Number' }, { text: 'Number:', data: link.split(':')[1] }]
}

const handleEmail = (link: string) => {
    var data = [{ text: 'Raw Decode:', data: link }, { text: 'Type: ', data: 'Email' }]
    var [mailIndex, subIndex, bodyIndex] = [link.indexOf('mailto:'), link.indexOf('?subject='), link.indexOf('body=')]

    const email = link.substring(mailIndex + 7, link.indexOf('?'))
    data.push({ text: 'Email:', data: email })

    const subject = link.substring(subIndex + 9, link.indexOf('&', subIndex + 8))
    if (subject.length > 0) data.push({ text: 'Subject:', data: decodeURI(subject) })

    const body = link.substring(bodyIndex + 5)
    if (body.length > 0) data.push({ text: 'Body:', data: decodeURI(body) })
    console.debug(decodeURI(body))

    return data
}

const handleWIFI = (link: string) => {
    var data = [{ text: 'Raw Decode:', data: link }, { text: 'Type: ', data: 'WiFi' }]
    var [authIndex, sIndex, pIndex] = [link.indexOf(':T:'), link.indexOf('S:'), link.indexOf(';P:')]
    if (authIndex > 0) {
        const auth = link.substring(authIndex + 3, sIndex - 1)
        data.push({ text: 'Authentication:', data: auth })
    }
    if (sIndex > 0) {
        const ssid = link.substring(sIndex + 2, link.indexOf(';', sIndex + 2))
        data.push({ text: 'Router:', data: ssid })
    }
    if (pIndex > 0) {
        const password = link.substring(pIndex + 3, link.indexOf(';', pIndex + 3))
        data.push({ text: 'Password', data: password })
    }
    return data
}

// Handles [Bitlinks, URL's, MeCard, Phone Number, SMS, Email, WiFi, Text]
// All other types ei [vCard, Event, SEPA, ...etc] will display as raw text
const handleQR = async (link: string, auth: Auth): Promise<linkInfo[]> => {
    if (link.startsWith('http')) {
        const x = new URL(link)

        var response = await axios.get(`${googleDNS}?name=${x.hostname}`);

        for (let obj of response.data[`Answer`]) {
            if (bitlyAddresses.includes(obj[`data`])) {
                return handleBitlink(x, auth)
            }
        }
        return [{ text: 'QR Link to ', data: link }]
    }
    if (link.toLowerCase().startsWith('mecard')) return handleMECARD(link)
    if (link.toLowerCase().startsWith('tel')) return handleTel(link)
    if (link.toLowerCase().startsWith('smsto')) return handleSMS(link)
    if (link.toLowerCase().startsWith('mailto')) return handleEmail(link)
    if (link.toLowerCase().startsWith('wifi')) return handleWIFI(link)
    return [{ text: 'Raw Decode:', data: link }]
}

type RootStackParamList = {
    Info: { qrURL: string };
    Home: undefined;
    Login: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Info'>;

export default function Info({ route, navigation }: Props) {
    const props = route.params
    const [bitlinkInfo, setBitlinkInfo] = useState<Array<linkInfo>>([])
    const { auth } = useTypedSelector((state) => state.auth);

    useEffect(() => {
        handleQR(props.qrURL, auth)
            .then(data => setBitlinkInfo(data))
    }, [])


    return (
        <View style={styles.container}>
            {bitlinkInfo.map(e => (
                e.text === 'Link:' 
                    ? (<Text key={`k-${e.text}`}>{e.text} <Text onPress={() => Linking.openURL(e.data)}>{e.data}</Text></Text>) :
                    <Text key={`k-${e.text}`}>{e.text} {e.data}</Text>
            ))}
            {auth.accessToken === "" && <Button
                title="Connect your Bitly Account" 
                onPress={() => navigation.navigate('Login')}/>}
            <Button
                title='Return to Home'
                onPress={() => navigation.navigate('Home')}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});