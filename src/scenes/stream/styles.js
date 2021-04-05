import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 10,
  },
  field: {
    fontSize: 15,
    marginBottom: 5,
    marginLeft: 10,
  },
  latestMessage: {
    fontSize: 15,
    marginBottom: 5,
    marginLeft: 10,
    opacity: 0.4,
    alignSelf: 'flex-start',
  },
  latestDate: {
    fontSize: 15,
    marginLeft: 10,
    opacity: 0.4,
    alignSelf: 'flex-end',
  },
  button: {
    backgroundColor: '#788eec',
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20,
    height: 48,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: 'center',
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
  item: {
    marginLeft: 10,
    marginRight: 10,
  },
  avatar: {
    margin: 10,
    alignSelf: "center",
  },
  Overlay: {
    flex: 1,
    position: "absolute",
    opacity: 1.0,
    bottom: 60,
    right: 30,
    justifyContent: "center",
  },
})