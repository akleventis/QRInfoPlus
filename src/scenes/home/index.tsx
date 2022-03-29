
import { StyleSheet, Text, View, Button } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getItemAsync } from 'expo-secure-store';
import { useState } from 'react';


type RootStackParamList = {
    Home: undefined;
    Scan: undefined;
    Login: undefined
};

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;


export default function Home({ navigation }: Props) {
    const getToken = () => {
        getItemAsync('access_token').then((token) => {
            if (token !== null) {
                setToken(token)
            }
        })
        return ''
    }
    const [token, setToken] = useState(getToken());
    return (
        <View style={styles.container}>
            {token === '' && <Button
                title="Connect your Bitly Account"
                onPress={() => navigation.navigate('Login')}
            />}
            {token !== '' && <Text>Your Bitly account is connected!</Text>}
            <Button
                title="Scan QR Code"
                onPress={() => navigation.navigate('Scan')}
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