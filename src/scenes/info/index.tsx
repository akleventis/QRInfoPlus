
import { StyleSheet, Text, View, Button } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import axios from 'axios'
import { URL } from 'react-native-url-polyfill';
import { useState } from 'react';
import { useEffect } from 'react';

const googleDNS = `https://dns.google/resolve`
const bitlyURL = `https://api-ssl.bitly.com/v4`
const bitlyAddresses = [`cname.bitly.com.`, `67.199.248.13`, `67.199.248.12`]
const authToken =  `82f2f38e4c48531c3d2bd4c1d89bcdc58679b185`

interface linkInfo {
    text: string,
    data: string
}

const handleBitlink = async (link: string): Promise<linkInfo[]> => {
    const x = new URL(link)
    let isBitlink = false;

    var response = await axios.get(`${googleDNS}?name=${x.hostname}`);

    for (let obj of response.data[`Answer`]) if (bitlyAddresses.includes(obj[`data`])) isBitlink = true

    if (!isBitlink) return [ {text: `${link}`, data: 'is not a bitlink'} ]

    const bitlink = `${x.host}${x.pathname}`
    try {
        const resp = await axios.post(`${bitlyURL}/expand`, {'bitlink_id': bitlink}, {headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        }});
        return [
            {text: 'Created', data: resp.data['created_at']},
            {text: 'ID', data: resp.data['id']},
            {text: 'Link', data: resp.data['link']},
            {text: 'Long url', data: resp.data['long_url']}
        ]
    } catch (err) {
        return [ {text: 'handleBitlinkErr', data: `${err}`} ]
    }
} 

type RootStackParamList = {
    Info: {qrURL: string};
    Home: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Info'>;

export default function Info({ route, navigation }: Props) {
    const props = route.params
    const [bitlinkInfo, setBitlinkInfo] = useState<Array<linkInfo>>([])

    useEffect(() => {
        handleBitlink(props.qrURL)
        .then(data => setBitlinkInfo(data))
    }, [])


    return (
        <View style={styles.container}>
            {bitlinkInfo.map(e => <Text key={e.text}>{e.text} {e.data}</Text>)}
            <Button
                title="Return to Home"
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