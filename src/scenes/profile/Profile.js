import React, { useEffect, useState } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import styles from './styles';

export default function Profile(props) {
  const userData = props.extraData

  const goDetail = () => {
    props.navigation.navigate('Detail', { userData: userData })
  }
  
  return (
    <View style={styles.root}>
      <Text style={styles.title}>Profile</Text>
      <Text>ID: {userData.id}</Text>
      <Text>Mail: {userData.email}</Text>
      <Text>Name: {userData.fullName}</Text>
      <TouchableOpacity style={styles.button} onPress={goDetail}>
        <Text style={styles.buttonText}>Go Detail</Text>
      </TouchableOpacity>
    </View>
  )
}