import { Text, View, StyleSheet, Dimensions } from 'react-native';
import { useAppSelector } from '../hooks/hooks'

const { height } = Dimensions.get('window');


export default function ErrorOverlay() {
    const { error } = useAppSelector((state) => state.error);
    return (
        <View style={styles.errorContainer}>
            <Text style={error.message ? styles.errorContent : {}}>{error.message}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    errorContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        elevation: 999,
        alignItems: 'center',
        zIndex: 10000,
        top: 20,
    },
    errorContent: {
        backgroundColor: 'red',
        padding: 10,
        color: 'white',
    }
});