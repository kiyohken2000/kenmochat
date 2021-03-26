import React, { useEffect, useState } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import styles from './styles';

export default function Home(props) {
  const userData = props.extraData
  return (
    <View style={styles.container}>
      <View style={{ flex: 1, width: '100%' }}>
      <View style={{ flex: 1 }}>
      </View>
        <Text style={styles.title}>Home screen</Text>
        <Text style={styles.field}>Mail:</Text>
        <Text style={styles.title}>{userData.email}</Text>
        <Text style={styles.field}>Name:</Text>
        <Text style={styles.title} >{userData.fullName}</Text>
        <TouchableOpacity style={styles.button} onPress={() => props.navigation.navigate('Talk')}>
          <Text style={styles.buttonText}>Go Talk</Text>
        </TouchableOpacity>
        <View style={styles.footerView}>
        </View>
      </View>
    </View>
  )
}