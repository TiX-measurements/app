import React from 'react';
import { Button, StyleSheet, Image } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View, TextInput } from '../components/Themed';
import { RootTabScreenProps } from '../types';

import Url from '../helpers/url'
import { createMessageAlert } from '../helpers/Alerts'
import { Config, AlertMessages, AlertTitles } from '../constants/Config'
import {CreateUserResponse, ErrorResponse} from '../types'
import { get, save } from '../helpers/storage';


export default function LogInScreen({ navigation }: RootTabScreenProps<'TabOne'>) {

  const [username, onChangeUsername] = React.useState("");
  const [pass, onChangePass] = React.useState("");
  
  function login() {
    
    const user = {
      username: username,
      password: pass,
    }

    new Url(Config.sources.backend).Post(Config.resources.login, user)
      .then(async (response) => {
        if (response.ok){

          const result = (await response.json()) as CreateUserResponse;
          save("token", result.token)
          save("username", result.username)
          save("id", result.id.toString())
          save("role", result.role)

          get(result.id.toString())
          .then((installation) => { 
            (installation) ? 
            navigation.navigate('Tabs')
            :
            navigation.navigate('Installation') 
          })
        }
        else if (response.status === 401) {
          const result = (await response.json()) as ErrorResponse;
          createMessageAlert(AlertTitles.error, result.reason)
        } else {
          createMessageAlert(AlertTitles.error, response.statusText)
        }
      })
      .catch((e)=>{
        createMessageAlert(AlertTitles.error, AlertMessages.connection)
      })
  }
  
  return (
    <View style={styles.container}>
      
      <Image  style={styles.logo} source= {require('../assets/images/logo.png')} /> 
      
      <View style={styles.inputs}>
        <TextInput style={styles.textInput}
          onChangeText={onChangeUsername}
          value={username}
          placeholder = 'Username'
          >
        </TextInput>
        <TextInput style={styles.textInput}
          onChangeText={onChangePass}
          value={pass}
          placeholder = 'Pasword'
          secureTextEntry = {true}>
        </TextInput>
      </View>
      <View style={styles.button}>
        <Button title='Log In' onPress={login} ></Button>
      </View>
    </View>
  );
}
//() => navigation.navigate('Tabs')
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  inputs: {
    alignItems: 'stretch',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  textInput: {
    height: 40,
    width: 200,
    margin: 5,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius:10,
  },
  button: {
    width: 200,
  },
});
