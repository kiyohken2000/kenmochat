import { StyleSheet, Dimensions } from 'react-native';

const ITEM_WIDTH = Dimensions.get('window').width
const height = Dimensions.get('window').height

export default StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    marginLeft: 20,
    marginRight: 20,
    flexDirection: 'row',
  },
  headertext: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerbutton: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  darktitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  field: {
    fontSize: 15,
    marginBottom: 5,
  },
  darkfield: {
    fontSize: 15,
    marginBottom: 5,
    color: 'white',
    opacity: 0.4,
  },
  exit: {
    backgroundColor: '#788eec',
    marginRight: 10,
  },
  button: {
    backgroundColor: '#788eec',
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20,
    height: 48,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: 'center'
  },
  buttonText: {
    color: 'white',
    fontSize: 16
  },
  footerView: {
    flex: 1,
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20
  },
  footerLink: {
    color: "#788eec",
    fontWeight: "bold",
    fontSize: 16
  },
  sendingContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  systemMessageText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold'
  },
  modaltitle: {
    paddingTop: 40,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  modalcontainer: {
    flex: 1,
  },
  darkmodalcontainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  footerContainer: {
    marginBottom: 70
  },
  item: {
    marginLeft: 20,
    marginRight: 20,
  },
  avatar: {
    margin: 10,
    alignSelf: "center",
  },
  userinfo: {
    justifyContent: 'center',
  },
  Overlay: {
    flex: 1,
    position: "absolute",
    opacity: 1.0,
    bottom: 60,
    right: 30,
    justifyContent: "center",
  },
  inputToolbar: {
  },
  darkinputToolbar: {
    backgroundColor: 'black'
  },
  textInputStyle: {
  },
  darktextInputStyle: {
    color: 'white'
  },
  logo: {
    height: 180,
    width: 180,
    alignSelf: "center",
  },
  bottomcontainer: {
    justifyContent: "center",
    alignSelf: "center",
  },
  bottomsheatcontainer: {
    backgroundColor: '#e6e6fa',
    height: height*0.6,
  },
  darkbottomsheatcontainer: {
    backgroundColor: '#303030',
    height: height*0.6,
  },
  divide: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20
  },
  imageStyle: {
    width: ITEM_WIDTH / 3,
    height: ITEM_WIDTH / 3,
    margin: 1,
    resizeMode: 'cover',
  },
  uploadcontainer: {
    width: '100%',
  },
  upload: {
    backgroundColor: '#4169e1',
    marginBottom: 10,
    borderRadius: 20,
    marginRight: 40,
    marginLeft: 40
  },
})
