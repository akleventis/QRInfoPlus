
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppSelector, useAppDispatch } from '../../hooks/hooks'
import { disconnect, loadAuth } from '../../actions/actionCreators'
import { useEffect } from 'react';
import ErrorOverlay from '../../components/errorOverlay';
const styles = require('../../styles.tsx')


type RootStackParamList = {
    Home: undefined;
    Scan: undefined;
    Login: undefined
};

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;


export default function Home({ navigation }: Props) {
    const { auth } = useAppSelector((state) => state.auth);
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
            <View style={styles.button}>
            <Button color='white' title="Scan QR Code" onPress={() => navigation.navigate('Scan')} />
            </View>
            <Image style={{width: 30, height: 30, marginTop: 20}}source={require('../../assets/bitly.png')}/>
            <ErrorOverlay />
        </View>
    );
}
