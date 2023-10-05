import React, { useState, useEffect } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
const styles = require('../../styles.tsx')

type RootStackParamList = {
    Scan: undefined;
    Info: {rawText: string};
};

type Props = NativeStackScreenProps<RootStackParamList, 'Scan'>;

export default function Scan({ navigation }: Props) {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [scanned, setScanned] = useState<boolean>(false);

    useEffect(() => {
      (async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
      })();
    }, []);
  
    const handleBarCodeScanned = ({ data }: {data: string}) => {
      setScanned(true);
      navigation.navigate('Info', {rawText: data})
      setScanned(false)
    };


    if (hasPermission === null) { return <Text>Requesting for camera permission</Text>; }  
    if (hasPermission === false) { return <Text>No access to camera</Text>; }

    return (
      <View style={styles.container}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
          style={StyleSheet.absoluteFillObject}
        />
      </View>
    );
  }