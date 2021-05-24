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
  darktitle: {
    fontSize: 24,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 10,
    color: 'white',
  },
  field: {
    fontSize: 15,
    marginBottom: 5,
    marginLeft: 10,
  },
  darkfield: {
    fontSize: 15,
    marginBottom: 5,
    marginLeft: 10,
    color: 'white',
  },
  input: {
    height: 48,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: 'white',
    marginTop: 10,
    marginLeft: 30,
    marginRight: 30,
    paddingLeft: 16
  },
  darkinput: {
    height: 48,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: '#808080',
    marginTop: 10,
    marginLeft: 30,
    marginRight: 30,
    paddingLeft: 16
  },
  button: {
    backgroundColor: '#788eec',
    marginLeft: 30,
    marginRight: 30,
    marginTop: 15,
    marginBottom: 20,
    height: 48,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: 'center'
  },
  nonbutton: {
    backgroundColor: '#CCCCCC',
    marginLeft: 30,
    marginRight: 30,
    marginTop: 15,
    marginBottom: 20,
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
  item: {
    marginLeft: 10,
    marginRight: 10,
  },
  avatar: {
    marginTop: 5,
  },
})
