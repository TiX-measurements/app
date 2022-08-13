import React, { useRef } from 'react';
import { Button, StyleSheet, Image } from 'react-native';

import * as SecureStore from 'expo-secure-store';

import { Text, View, TextInput } from '../components/Themed';
import { RootTabScreenProps } from '../types';

import { createMessageAlert } from '../helpers/Alerts'
import Url from '../helpers/url'
import { Config, AlertMessages, AlertTitles } from '../constants/Config'
import { ErrorResponse } from '../types'

import Recaptcha, { RecaptchaHandles } from 'react-native-recaptcha-that-works';

export default function RegisterFormScreen({ navigation }: RootTabScreenProps<'RegisterForm'>) {

  const recaptcha = useRef<RecaptchaHandles>(null);

  const [username, onChangeUsername] = React.useState("");
  const [pass, onChangePass] = React.useState("");
  const [verifyPass, onChangeVerifyPass] = React.useState("");
  const [verifyColor, onChangeVerifyColor] = React.useState({borderColor: 'green',  underlineColorAndroid: 'green'});

  function ChangeInputColor(text1:string, text2:string) {
    if (text1 === text2){
      onChangeVerifyColor({borderColor: 'green', underlineColorAndroid: 'green'})
    } else {
      onChangeVerifyColor({borderColor: 'red', underlineColorAndroid: 'red' })
    }    
  }

  function TextVerifyInputChange(vPass:string) {
    onChangeVerifyPass(vPass);
    ChangeInputColor(vPass, pass);
  }

  function TextInputChange(password:string) {
    onChangePass(password);
    ChangeInputColor(password, verifyPass);
  }

  function signup(token: string) {
    const user = {
      captcharesponse: token,
      username: username,
      password1:pass,
      password2: verifyPass
    }
    new Url(Config.sources.backend).Post(Config.resources.signup, user)
    .then(async (response) => {
      console.log(await response.json())
      if (response.ok){
        navigation.navigate('TabOne');
      } else if (response.status === 403) {
        const result = (await response.json()) as ErrorResponse;
        createMessageAlert(AlertTitles.error, result.reason);
      } else {
        createMessageAlert(AlertTitles.error, response.statusText)
      }
    })
    .catch((e) => {
      createMessageAlert(AlertTitles.error, e.message)
    })
  }

  const send = () => {
    if (pass !== verifyPass || pass === '' || username === '')
    {
      createMessageAlert(AlertTitles.error, AlertMessages.signup)
      ChangeInputColor(pass, verifyPass);
    } 
    else 
    {
      recaptcha.current?.open();
    }
    
  };

  const onExpire = () => {
      console.warn('expired!');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <View style={styles.inputs}>
        <TextInput style={styles.textInput}
          onChangeText={onChangeUsername}
          value={username}
          placeholder = 'Username'>
        </TextInput>
        <TextInput style={styles.textInput}
          onChangeText={(e)=>{TextInputChange(e)}}
          value={pass}
          placeholder = 'Pasword'
          secureTextEntry = {true}>
        </TextInput>
        <TextInput 
          {... verifyColor}
          style={styles.textInput}
          
          onChangeText={(e)=>{TextVerifyInputChange(e)}}
          value={verifyPass}
          placeholder = 'Verify Pasword'
          secureTextEntry = {true}>
        </TextInput>
        <Recaptcha
                ref={recaptcha}
                siteKey="6LexqSAUAAAAAKD-PBs2MePg0TCpRuyFi4-HJ66R"
                baseUrl="https://www.google.com/recaptcha/api/siteverify"
                onVerify={signup}
                onExpire={onExpire}
                size="normal"
            />
      </View>
      <View style={styles.button}>
        <Button title='Sign Up' onPress={send} ></Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'column',
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
  },
  inputs: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  textInput: {
    width: 200,  
    height: 40,
    margin: 5,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
  textWrongInput: {
    width: 200,  
    height: 40,
    margin: 5,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  }
  ,
  button: {
    width: 200,
  },
});
