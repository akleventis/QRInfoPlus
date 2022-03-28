
import { StyleSheet, Text, View, Button } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';


type RootStackParamList = {
    Info: undefined;
    Home: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Info'>;

export default function Info({ navigation }: Props) {
    return (
        <View style={styles.container}>
            <Text>This is the Info Page</Text>

            <Button
                title="Return to Home"
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