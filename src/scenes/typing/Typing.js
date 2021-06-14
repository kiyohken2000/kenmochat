import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { firebase } from '../../firebase/config'
import { TypingAnimation } from 'react-native-typing-animation'

export default function TypingIndicator(props) {
  const input = props.input
  const email = props.myProfile.email
  const id = props.talkData.id
  const screen = props.screen
  const [typing, setTyping] = useState([])

  useEffect(() => {
    if (input) {
      firebase.firestore().collection(screen).doc(id).set({
        typing: firebase.firestore.FieldValue.arrayUnion(email)
      }, { merge: true })
    } else {
      firebase.firestore().collection(screen).doc(id).set({
        typing: firebase.firestore.FieldValue.arrayRemove(email)
      }, { merge: true })
    }
  }, [input]);

  useEffect(() => {
    const typingListner = firebase.firestore()
      .collection(screen)
      .doc(id)
      .onSnapshot(function(document) {
        const data = document.data()
        const typing = data.typing
        setTyping(typing)
      })
    return () => typingListner()
  }, []);

  function isTyping(array) {
    console.log(array.length)
    if (array.length) {
      return (
          <TypingAnimation dotColor={'#b0c4de'} dotSpeed={0.1}/>
      )
    } else {
      return null
    }
  }

  return (
    <View style={{height:18}}>
      {isTyping(typing)}
    </View>
  )
}