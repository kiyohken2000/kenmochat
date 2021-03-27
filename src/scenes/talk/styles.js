import { StyleSheet } from 'react-native';

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
  footerContainer: {
    marginBottom: 70
  },
  item: {
    marginLeft: 20,
    marginRight: 20,
  },
})
