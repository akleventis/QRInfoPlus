
import { Text, View, Button, Image } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppSelector, useAppDispatch } from '../../hooks/hooks'
import { disconnect, loadAuth, setBitlyRouter, setDefaultRouter } from '../../actions/actionCreators'
import {RouterType } from '../../actions/actionTypes';
import { useEffect } from 'react';
import ErrorOverlay from '../../components/errorOverlay';
import React from 'react';
const styles = require('../../styles.tsx')


type RootStackParamList = {
    Home: undefined;
    Scan: undefined;
    Login: undefined
};

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;


export default function Home({ navigation }: Props) {
    const { auth } = useAppSelector((state) => state.auth);
    const { router } = useAppSelector((state) => state.router);
    const dispatch = useAppDispatch();

    useEffect(() => {
        // attempt to load auth info from secure store
        if (auth.accessToken === '' && auth.login === '') {
            dispatch(loadAuth())
        }
    }, [])

    return (
        <View style={styles.container}>
            {auth.accessToken === '' && <View style={styles.button}><Button
                color='white'
                title="Connect your Bitly Account"
                onPress={() => navigation.navigate('Login')}
            /></View>}
            {auth.accessToken !== '' && <View style={styles.auth_container}><Text style={styles.auth_text}>Hello {auth.login}, your Bitly account is connected! 🥳</Text></View>}
            {auth.accessToken !== '' && <View style={styles.button}><Button color='white' title="Disconnect" onPress={() => dispatch(disconnect())} /></View>}
            {router !== RouterType.BITLY_V4 && auth.accessToken !== '' && <View style={styles.button}><Button color='white' title="Set Bitly Router" onPress={() => dispatch(setBitlyRouter())} /></View>}
            {router !== RouterType.DEFAULT && <View style={styles.button}><Button color='white' title="Set Default Router" onPress={() => dispatch(setDefaultRouter())} /></View>}
            <View style={styles.button}>
            <Button color='white' title="Scan QR Code" onPress={() => navigation.navigate('Scan')} />
            </View>
            <Image style={styles.bitly_logo} source={require('../../assets/bitly.png')}/>
            {(router === RouterType.BITLY_V4) ? <Text style={{color: 'grey'}}>Bitly Router</Text> : <Text style={{color: 'grey'}}>Default Router</Text>}
            <ErrorOverlay />
        </View>
    );
}
