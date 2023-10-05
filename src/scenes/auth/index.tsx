import { Image, View, Button, Text } from 'react-native';
import { useAuthRequest } from 'expo-auth-session';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/hooks';
import {RouterType } from '../../actions/actionTypes';
import { authorize, setError } from '../../actions/actionCreators'
import ErrorOverlay from '../../components/errorOverlay';
import { getBitlyURL } from '../../lib/helpers';

const styles = require('../../styles.tsx')

type RootStackParamList = {
    Login: undefined;
    Home: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function Login({ navigation }: Props) {
    const dispatch = useAppDispatch();
    const { router } = useAppSelector((state) => state.router);
    const bitlyURL = getBitlyURL()

    const discovery = {
        authorizationEndpoint: `${bitlyURL}/oauth/authorize`,
    };
    const [request, response, promptAsync] = useAuthRequest({
        clientId: process.env.EXPO_PUBLIC_CLIENT_ID ?? "",
        usePKCE: false,
        redirectUri: process.env.EXPO_PUBLIC_REDIRECT_URI ?? "",
    }, discovery);

    useEffect(() => {
        switch (response?.type) {
            case "success":
                const { code } = response.params
                dispatch(authorize(code))
                navigation.navigate('Home')
                break;
            case "cancel":
                dispatch(setError('Authorization Cancelled'))
                navigation.navigate('Home')
                break;
            case "error":
                dispatch(setError('Authorization Error'))
                navigation.navigate('Home')
                break;
        }
    }, [response])

    return (
        <View style={styles.container}>
            <View style={styles.button}>
            <Button color='white' title="Connect" onPress={() => promptAsync()} />
            </View>
            <View style={styles.button}>
            <Button color='white' title="Return Home" onPress={() => navigation.navigate('Home')} />
            </View>
            <Image style={styles.bitly_logo} source={require('../../assets/bitly.png')}/>
            {(router === RouterType.BITLY_V4) ? <Text style={{color: 'grey'}}>Bitly Router</Text> : <Text style={{color: 'grey'}}>Default Router</Text>}
            <ErrorOverlay />
        </View>
    );
}