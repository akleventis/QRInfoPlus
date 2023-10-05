
import handleQRScan from './handlers'
import type { QRInfo } from './handlers'
import { Text, View, Button, Linking, Image, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppSelector, useAppDispatch } from '../../hooks/hooks'
import {RouterType } from '../../actions/actionTypes';
import { useState } from 'react';
import { useEffect } from 'react';
import ErrorOverlay from '../../components/errorOverlay';
import { setError } from '../../actions/actionCreators';
import React from 'react';
const styles = require('../../styles.tsx')

type RootStackParamList = {
    Info: { rawText: string };
    Home: undefined;
    Login: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Info'>;

function bitlink(bitlinkInfo: QRInfo) {
    return (
            <View>

                <Text style={styles.info_title}>Bitlink</Text>
                <View style={styles.info_c}>
                    <Text style={styles.info_data}>{bitlinkInfo.bitlink}</Text>
                </View>


                <Text style={styles.info_title}>Expanded URL</Text>
                <View style={styles.info_c}>
                    <Text style={styles.info_data}>{bitlinkInfo.long_url}</Text>
                </View>

                <Text style={styles.info_title}>Created</Text>
                <View style={styles.info_c}>
                    <Text style={styles.info_data}>{bitlinkInfo.created}</Text>
                </View>

                {bitlinkInfo.brand_guid && 
                            <>
                                <Text style={styles.info_title}>Brand GUD</Text>
                                <View style={styles.info_c}>
                                    <Text style={styles.info_data}>{bitlinkInfo.brand_guid}</Text>
                                </View>
                            </>}
                            
                <View style={[styles.info_c, styles.link_c]}>
                    <Text style={styles.link} onPress={() => Linking.openURL(bitlinkInfo.raw_decode)}>🔗 Follow Link 🔗</Text>
                </View>

            </View>
    )
}

function MECard(bitlinkInfo: QRInfo) {

    return (
        <View>
            <Text style={styles.info_title}>Name</Text>
            <View style={styles.info_c}>
                <Text style={styles.info_data}>{bitlinkInfo.name}</Text>
            </View>
            
            <Text style={styles.info_title}>Phone Number</Text>
            <View style={styles.info_c}>
                <Text style={styles.info_data}>{bitlinkInfo.phone}</Text>
            </View>
            
            <Text style={styles.info_title}>Email Address</Text>
            <View style={styles.info_c}>
                <Text style={styles.info_data}>{bitlinkInfo.email}</Text>
            </View>

            <Text style={styles.info_title}>Notes</Text>
            <View style={styles.info_c}>
                <Text style={styles.info_data}>{bitlinkInfo.note}</Text>
            </View>
        </View>
    )
}

function SMS(bitlinkInfo: QRInfo) {
    return (
        <View>
            <Text style={styles.info_title}>Phone Number</Text>
            <View style={styles.info_c}>
                <Text style={styles.info_data}>{bitlinkInfo.phone}</Text>
            </View>

            <Text style={styles.info_title}>Message Body</Text>
            <View style={styles.info_c}>
                <Text style={styles.info_data}>{bitlinkInfo.body}</Text>
            </View>
        </View>
    )
}

function Tel(bitlinkInfo: QRInfo) {
    return (
        <View>
            <Text style={styles.info_title}>Phone Number</Text>
            <View style={styles.info_c}>
                <Text style={styles.info_data}>{bitlinkInfo.phone}</Text>
            </View>
        </View>
    )
}

function email(bitlinkInfo: QRInfo) {
    return (
        <View>
            <Text style={styles.info_title}>Email Address</Text>
            <View style={styles.info_c}>
                <Text style={styles.info_data}>{bitlinkInfo.email}</Text>
            </View>

            <Text style={styles.info_title}>Subject</Text>
            <View style={styles.info_c}>
                <Text style={styles.info_data}>{bitlinkInfo.subject}</Text>
            </View>

            <Text style={styles.info_title}>Body</Text>
            <View style={styles.info_c}>
                <Text style={styles.info_data}>{bitlinkInfo.body}</Text>
            </View>
        </View>
    )
}

function Wifi(bitlinkInfo: QRInfo) {
    return (
        <View>
            <Text style={styles.info_title}>Authentication</Text>
            <View style={styles.info_c}>
                <Text style={styles.info_data}>{bitlinkInfo.authentication}</Text>
            </View>

            <Text style={styles.info_title}>SSID</Text>
            <View style={styles.info_c}>
                <Text style={styles.info_data}>{bitlinkInfo.ssid}</Text>
            </View>

            <Text style={styles.info_title}>Password</Text>
            <View style={styles.info_c}>
                <Text style={styles.info_data}>{bitlinkInfo.password}</Text>
            </View>
        </View>
    )
}

export default function Info({ route, navigation }: Props) {
    const props = route.params
    const [bitlinkInfo, setBitlinkInfo] = useState<QRInfo>({} as QRInfo)
    const { auth } = useAppSelector((state) => state.auth);
    const { router } = useAppSelector((state) => state.router);
    const dispatch = useAppDispatch();

    useEffect(() => {
        handleQRScan(props.rawText, auth, router)
            .then(data => setBitlinkInfo(data))
    }, [])

    useEffect(() => {
        if (bitlinkInfo.error) {
            dispatch(setError(bitlinkInfo.error))
        }
    }, [bitlinkInfo.error])


    return (
        <ScrollView style={styles.scroll_container}>
            <View style={styles.container}>
                <ErrorOverlay />
                <View>
                    <Text style={styles.info_title}>QR Code Type</Text>
                    <View style={styles.info_c}>
                        <Text style={styles.info_data}>{bitlinkInfo.type}</Text>
                    </View>

                    <Text style={styles.info_title}>Decoded Data</Text>
                    <View style={styles.info_c}>
                        <Text style={styles.info_data}>{bitlinkInfo.raw_decode}</Text>
                    </View>

                    {bitlinkInfo.type === 'Bitly URL' && bitlink(bitlinkInfo)}
                    {bitlinkInfo.type === 'Contact Card' && MECard(bitlinkInfo)}
                    {bitlinkInfo.type === 'SMS' && SMS(bitlinkInfo)}
                    {bitlinkInfo.type === 'phone Number' && Tel(bitlinkInfo)}
                    {bitlinkInfo.type === 'email' && email(bitlinkInfo)}
                    {bitlinkInfo.type === 'Wifi' && Wifi(bitlinkInfo)}

                    {bitlinkInfo.cta_link && 
                    <View  style={[styles.info_c, styles.link_c]}><Text style={styles.link} onPress={() => Linking.openURL(bitlinkInfo.cta_link)}>Open in Bitly</Text></View>}
                </View>
                {auth.accessToken === "" && <View style={styles.button}><Button color='white' title="Connect your Bitly Account" onPress={() => navigation.navigate('Login')} /></View>}
                <View style={styles.button}>
                <Button color='white' title='Return to Home' onPress={() => navigation.navigate('Home')} />
                </View>

                <Image style={styles.bitly_logo} source={require('../../assets/bitly.png')}/>
                {(router === RouterType.BITLY_V4) ? <Text style={{color: 'grey'}}>Bitly Router</Text> : <Text style={{color: 'grey'}}>Default Router</Text>}
            </View>
        </ScrollView>
    );
}