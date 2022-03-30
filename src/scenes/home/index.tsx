
import { StyleSheet, Text, View, Button } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTypedSelector } from '../../hooks/useTypeSelector'
import { useDispatch } from 'react-redux';
import { disconnect, loadAuth } from '../../actions/actionCreators'
import { useEffect } from 'react';



type RootStackParamList = {
    Home: undefined;
    Scan: undefined;
    Login: undefined
};

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;


export default function Home({ navigation }: Props) {
    const { auth } = useTypedSelector((state) => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        // attempt to load auth info from secure store
        if (auth.accessToken === '' && auth.login === '') {
            dispatch(loadAuth())
        }
    }, [])

    return (
        <View style={styles.container}>
            {auth.accessToken === '' && <Button
                title="Connect your Bitly Account"
                onPress={() => navigation.navigate('Login')}
            />}
            {auth.accessToken !== '' && <Text>Hello {auth.login}, your Bitly account is connected!</Text>}
            {auth.accessToken !== '' && <Button
                title="Disconnect"
                onPress={() => dispatch(disconnect())}
            />}
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