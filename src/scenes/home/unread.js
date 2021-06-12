import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { firebase } from '../../firebase/config'
import FontIcon from 'react-native-vector-icons/FontAwesome5'

export default function Unread(props) {
  console.log('StartScreen')
  const id = props.talk.id
  const email = props.data.email
  const createdAt = props.talk.latestMessage.createdAt
  const [data, setData] = useState([])

  useEffect(() =>{
    const unmount = firebase.firestore().collection('talk').doc(id)
    .onSnapshot(function(doc) {
      const data = doc.data().latestMessage.unread
      if (data) {
        setData(data)
      }
    });
    console.log('useEffect')
    return () => unmount()
  },[createdAt])

  function info(i) {
    if (i.includes(email)) {
      return <FontIcon name="circle" color='#4169e1' size={10} solid />
    } else {
      return <FontIcon name="circle" color='transparent' size={10} solid />
    }
  }

  return (
    <View>
      {info(data)}
    </View>
  )
}