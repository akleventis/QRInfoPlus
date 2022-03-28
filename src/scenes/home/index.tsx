
import { StyleSheet, Text, View, Button } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';


type RootStackParamList = {
    Home: undefined;
    Scan: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;


export default function Home({ navigation }: Props) {
    return (
        <View style={styles.container}>
            <Text>This is the Home Page</Text>
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