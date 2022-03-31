
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

interface QRInfo {
    // Common fields
    Type: string
    RawDecode: string,
    Error: string
    CTA: string,
    CTALink: string,

    // Bitlink Fields
    Bitlink: string,
    LongURL: string,
    Created: string,

    // Email Fields
    Email: string,
    Subject: string,
    Body: string,

    // SMS Fields
    Phone: string,

    // MECard Fields
    Name: string,
    Note: string,

    // WIFI
    Authentication: string,
    SSID: string,
    Password: string,

}

const handleBitlink = async (link: URL, auth: Auth): Promise<QRInfo> => {
    const bitlink = `${link.host}${link.pathname}`
    let data = {
        Type: 'Bitly URL',
        RawDecode: link.toString()
    } as QRInfo

    if (auth.accessToken === '') {
        data.Error = 'Connect Bitly account to expand'
        return data
    }

    try {
        const resp = await axios.post(`${bitlyURL}/expand`, { 'bitlink_id': bitlink }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.accessToken}`
            }
        });
        const hash = resp.data['id'].split('/')[1]
        data.Bitlink = resp.data['link']
        data.Created = resp.data['created_at']
        data.LongURL = resp.data['long_url']
        data.CTA = 'Open in Bitly'
        data.CTALink = `https://app.bitly.com/default/bitlinks/${hash}`
    } catch (err) {
        data.Error = 'There was an error expanding this link'
    }

    return data
}

const handleMECARD = (link: string) => {
    var data = {
        RawDecode: link,
        Type: 'Contact Card'
    } as QRInfo

    var [nameIndex, telIndex, mailIndex, noteIndex] = [link.indexOf(':N:'), link.indexOf(';TEL:'), link.indexOf(';EMAIL:'), link.indexOf(';NOTE:')]
    if (nameIndex > 0) {
        let name = link.substring(nameIndex + 3, link.indexOf(';'))
        data.Name = name
    }
    if (telIndex > 0) {
        let tel = link.substring(telIndex + 5, link.indexOf(';', telIndex + 5))
        data.Phone = tel
    }
    if (mailIndex > 0) {
        let mail = link.substring(mailIndex + 7, link.indexOf(';', mailIndex + 7))
        data.Email = mail
    }
    if (noteIndex > 0) {
        let note = link.substring(noteIndex + 6, link.indexOf(';', noteIndex + 6))
        data.Note = note
    }
    return data
}

const handleSMS = (link: string) => {
    var data = {
        RawDecode: link,
        Type: 'SMS',
    } as QRInfo

    var a = link.split(':', 3)
    if (a[1] !== '') data.Phone = a[1]
    if (a[2] !== '') data.Body = a[2]
    return data
}

const handleTel = (link: string) => {
    var data = {
        RawDecode: link,
        Type: 'Phone Number',
        Phone: link.split(':')[1]
    } as QRInfo
    return data
}

const handleEmail = (link: string) => {
    var data = {
        RawDecode: link,
        Type: 'Email',
    } as QRInfo

    var [mailIndex, subIndex, bodyIndex] = [link.indexOf('mailto:'), link.indexOf('?subject='), link.indexOf('body=')]

    const email = link.substring(mailIndex + 7, link.indexOf('?'))
    data.Email = email

    const subject = link.substring(subIndex + 9, link.indexOf('&', subIndex + 8))
    if (subject.length > 0) data.Subject = decodeURI(subject)

    const body = link.substring(bodyIndex + 5)
    if (body.length > 0) data.Body = decodeURI(body)

    return data
}

const handleWIFI = (link: string) => {
    var data = {
        RawDecode: link,
        Type: 'Wifi',
    } as QRInfo

    var [authIndex, sIndex, pIndex] = [link.indexOf(':T:'), link.indexOf('S:'), link.indexOf(';P:')]
    if (authIndex > 0) {
        const auth = link.substring(authIndex + 3, sIndex - 1)
        data.Authentication = auth
    }
    if (sIndex > 0) {
        const ssid = link.substring(sIndex + 2, link.indexOf(';', sIndex + 2))
        data.SSID = ssid
    }
    if (pIndex > 0) {
        const password = link.substring(pIndex + 3, link.indexOf(';', pIndex + 3))
        data.Password = password
    }
    return data
}

// Handles [Bitlinks, URL's, MeCard, Phone Number, SMS, Email, WiFi, Text]
// All other types ei [vCard, Event, SEPA, ...etc] will display as raw text
const handleQR = async (link: string, auth: Auth): Promise<QRInfo> => {
    if (link.startsWith('http')) {
        const x = new URL(link)

        var response = await axios.get(`${googleDNS}?name=${x.hostname}`);

        for (let obj of response.data[`Answer`]) {
            if (bitlyAddresses.includes(obj[`data`])) {
                return handleBitlink(x, auth)
            }
        }
        return { RawDecode: link, Type: 'URL' } as QRInfo
    }
    if (link.toLowerCase().startsWith('mecard')) return handleMECARD(link)
    if (link.toLowerCase().startsWith('tel')) return handleTel(link)
    if (link.toLowerCase().startsWith('smsto')) return handleSMS(link)
    if (link.toLowerCase().startsWith('mailto')) return handleEmail(link)
    if (link.toLowerCase().startsWith('wifi')) return handleWIFI(link)
    return { RawDecode: link, Type: 'Text' } as QRInfo
}

type RootStackParamList = {
    Info: { qrURL: string };
    Home: undefined;
    Login: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Info'>;

function Bitlink(bitlinkInfo: QRInfo) {
    return (
        <View>
            <Text>Bitlink: {bitlinkInfo.Bitlink}</Text>
            <Text onPress={() => Linking.openURL(bitlinkInfo.RawDecode)}>Open Link</Text>
            <Text>Expanded URL: {bitlinkInfo.LongURL}</Text>
            <Text>Created On: {bitlinkInfo.Created}</Text>
        </View>
    )
}

function MECard(bitlinkInfo: QRInfo) {
    return (
        <View>
            <Text>Name: {bitlinkInfo.Name}</Text>
            <Text>Phone Number: {bitlinkInfo.Phone}</Text>
            <Text>Email Address: {bitlinkInfo.Email}</Text>
            <Text>Notes: {bitlinkInfo.Note}</Text>
        </View>
    )
}

function SMS(bitlinkInfo: QRInfo) {
    return (
        <View>
            <Text>Phone Number: {bitlinkInfo.Phone}</Text>
            <Text>Message Body: {bitlinkInfo.Body}</Text>
        </View>
    )
}

function Tel(bitlinkInfo: QRInfo) {
    return (
        <View>
            <Text>Phone Number: {bitlinkInfo.Phone}</Text>
        </View>
    )
}

function Email(bitlinkInfo: QRInfo) {
    return (
        <View>
            <Text>Email Address: {bitlinkInfo.Email}</Text>
            <Text>Subject: {bitlinkInfo.Subject}</Text>
            <Text>Body: {bitlinkInfo.Body}</Text>
        </View>
    )
}

function Wifi(bitlinkInfo: QRInfo) {
    return (
        <View>
            <Text>Authentication: {bitlinkInfo.Authentication}</Text>
            <Text>SSID: {bitlinkInfo.SSID}</Text>
            <Text>Password: {bitlinkInfo.Password}</Text>
        </View>
    )
}

export default function Info({ route, navigation }: Props) {
    const props = route.params
    const [bitlinkInfo, setBitlinkInfo] = useState<QRInfo>({} as QRInfo)
    const { auth } = useTypedSelector((state) => state.auth);

    useEffect(() => {
        handleQR(props.qrURL, auth)
            .then(data => setBitlinkInfo(data))
    }, [])


    return (
        <View style={styles.container}>
            <View>
                <Text>QR Code Type: {bitlinkInfo.Type}</Text>
                <Text>Decoded data: {bitlinkInfo.RawDecode}</Text>

                {bitlinkInfo.Type === 'Bitly URL' && Bitlink(bitlinkInfo)}
                {bitlinkInfo.Type === 'Contact Cart' && MECard(bitlinkInfo)}
                {bitlinkInfo.Type === 'SMS' && SMS(bitlinkInfo)}
                {bitlinkInfo.Type === 'Phone Number' && Tel(bitlinkInfo)}
                {bitlinkInfo.Type === 'Email' && Email(bitlinkInfo)}
                {bitlinkInfo.Type === 'Wifi' && Wifi(bitlinkInfo)}

                {bitlinkInfo.CTA !== '' && <Text onPress={() => Linking.openURL(bitlinkInfo.CTALink)}>{bitlinkInfo.CTA}</Text>}
                {bitlinkInfo.Error !== '' && <Text>{bitlinkInfo.Error}</Text>}
            </View>
            {auth.accessToken === "" && <Button
                title="Connect your Bitly Account"
                onPress={() => navigation.navigate('Login')} />}
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