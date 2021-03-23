import React, { useEffect, useState } from 'react'
import { Text, View, TextInput } from 'react-native'
import styles from './styles';

export default function User() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>User profile</Text>
    </View>
  )
}