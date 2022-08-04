import React from 'react';
import { Button, StyleSheet, Image } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Text, View  } from '../components/Themed';
import { RootTabScreenProps } from '../types';

export default function WelcomeScreen({ navigation }: RootTabScreenProps<'Welcome'>) {

  return (
    <View style={styles.container}>
      <View style={styles.header}>  
        <Text style={styles.title}>Welcome</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <Image  style={styles.logo} source= {require('../assets/images/logo.png')} />
      </View> 
      <View style={styles.bottons}>
        <Button title='Log In' onPress={() => navigation.navigate('TabOne')}></Button>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <Button title='Create new account' onPress={() => navigation.navigate('RegisterForm')}></Button>
      </View>  
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 5,
    height: 1,
    width: '80%',
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius:10,
  },
  bottons: {
    alignItems: 'stretch',
    justifyContent: 'space-between',
    flexDirection: 'column'
  },
});
