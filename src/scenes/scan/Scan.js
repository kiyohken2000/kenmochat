import React, { useEffect, useState } from 'react'
import { Text, View, StatusBar, useColorScheme } from 'react-native'
import styles from './styles'
import { firebase } from '../../firebase/config'
import { BarCodeScanner } from 'expo-barcode-scanner'

export default function Scan({ route, navigation }) {
  const [hasPermission, setHasPermission] = useState(null)
  const [scanned, setScanned] = useState(false)
  const scheme = useColorScheme()
  const userData = route.params.userData

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true)
    const usersRef2 = firebase.firestore().collection('users2').doc(data)
    usersRef2.get().then((doc) => {
      const userProfile = doc.data()
      setScanned(false)
      navigation.navigate('User', { user: userProfile, myProfile: userData })
    }).catch((error) => {
        console.log("Error getting document:", error);
        setScanned(false)
    });
  };

  if (hasPermission === null) {
    return <Text style={scheme === 'dark' ? styles.darkfield : styles.field}>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text style={scheme === 'dark' ? styles.darkfield : styles.field}>No access to camera</Text>;
  }
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={styles.scan}
      >
        <View style={styles.overlay}>
          <View style={styles.preloader}>
            <Text>Scan a QR code</Text>
          </View>
        </View>
      </BarCodeScanner>
    </View>
  )
}