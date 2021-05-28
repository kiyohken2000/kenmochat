import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window')
const qrSize = width * 0.8

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scan: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  field: {
    fontSize: 15,
  },
  darkfield: {
    fontSize: 15,
    color: 'white',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  preloader: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    width: qrSize,
    height: qrSize,
    borderRadius: 50,
  },
})
