
import { StyleSheet, Text, View, Button } from 'react-native';
import { useAuthRequest } from 'expo-auth-session';
import { setItemAsync } from 'expo-secure-store';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CLIENT_ID, CLIENT_SECRET } from '../../config/secrets';
import { useEffect } from 'react';

type RootStackParamList = {
    Login: undefined;
    Home: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const getAccessToken = async (code: string) => {
    let form = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET, // TODO: store this more securely?
        'code': code,
        'redirect_uri': 'exp://127.0.0.1:19000/',
    }

    const formBody = Object.entries(form).map(([key, value]) => encodeURIComponent(key) + '=' + encodeURIComponent(value)).join('&')

    fetch('https://api-ssl.bitly.com/oauth/access_token', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formBody
    }).then(response => {
        if (!response.ok) {
            console.log('Access token request failed');
        }
        return response.json();
    })
        .then(json => {
            const { access_token } = json;
            setItemAsync('access_token', access_token);
        });
}


export default function Login({ navigation }: Props) {
    const discovery = {
        authorizationEndpoint: "https://bitly.com/oauth/authorize",
    };
    const [request, response, promptAsync] = useAuthRequest({
        clientId: CLIENT_ID,
        usePKCE: false,
        redirectUri: "exp://127.0.0.1:19000/",
    }, discovery);

    useEffect(() => {
        if (response?.type === "success") {
            const { code } = response.params
            getAccessToken(code).then(() => {
                navigation.navigate('Home');
            })
        }
    }, [response])

    return (
        <View style={styles.container}>
            <Button
                title="Connect"
                onPress={() => promptAsync()}
            />
            <Button
                title="Return Home"
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