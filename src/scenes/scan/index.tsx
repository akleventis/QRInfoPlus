
import { StyleSheet, Text, View, Button } from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
    Scan: undefined;
    Info: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Scan'>;


export default function Scan({ navigation }: Props) {
    return (
        <View style={styles.container}>
            <Text>This is the Scan Page</Text>
            <Button
                title="I scanned a QR Code"
                onPress={() => navigation.navigate('Info')}
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