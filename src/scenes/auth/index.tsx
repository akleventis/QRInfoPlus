
import { StyleSheet, Text, View, Button } from 'react-native';
import { useAuthRequest } from 'expo-auth-session';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CLIENT_ID } from '../../config/secrets';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { authorize } from '../../actions/actionCreators'

type RootStackParamList = {
    Login: undefined;
    Home: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;


export default function Login({ navigation }: Props) {
    const dispatch = useDispatch();
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
            dispatch(authorize(code))
            navigation.navigate('Home')
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