import React from 'react';
import { Button, StyleSheet, Image } from 'react-native';
import { Text, View, TextInput } from '../components/Themed';
import { RootTabScreenProps } from '../types';

import Url from '../helpers/url'
import { createMessageAlert } from '../helpers/Alerts'
import { Config, AlertMessages, AlertTitles } from '../constants/Config'
import {CreateUserResponse, ErrorResponse} from '../types'
import { get, save } from '../helpers/storage';
import { generateKeyPair, pemToDer64 } from '../helpers/crypto';


export default function AddInstallation({ navigation }: RootTabScreenProps<'TabOne'>) {

  const [installation_name, onChangeInstallationName] = React.useState("");
  
  async function saveInstallation() {
    
    if (installation_name === ''){
      createMessageAlert(AlertTitles.error, AlertMessages.emptyField);
      return;
    }

    let userId = await get('id');
    let token = await get('token');
    let pubKey = await generateKeyPair(`${userId}_tix.app`);
    
    const installation = {
      name: installation_name,
      publickey: pemToDer64(pubKey)
    }

    new Url(Config.sources.backend)
    .Post(
      Config.resources.addInstallation(userId as string),
      installation,
      {Authorization: 'JWT '+ token}
    )
      .then(async (response) => {
        if (response.ok){
          let result = await response.json();
          save(userId, result?.id?.toString());
          save(`${userId}_installationName`, installation_name);
          save(`${userId}_pubkey`, pubKey);
          navigation.navigate('Tabs');
        }
        else if (response.status === 401) {
          const result = (await response.json()) as ErrorResponse;
          createMessageAlert(AlertTitles.error, result.reason)
        }
        else {createMessageAlert(AlertTitles.error, AlertMessages.login)}
      })
      .catch((e)=> {
        createMessageAlert(AlertTitles.error, e.message)
      })
  
  }
  
  return (
    <View style={styles.container}>
      <Image  style={styles.logo} source= {require('../assets/images/logo.png')} /> 
      
      <View style={styles.inputs}>
        <TextInput style={styles.textInput}
          onChangeText={onChangeInstallationName}
          value={installation_name}
          placeholder = 'Installation Name'
          >
        </TextInput>
      </View>
      <View style={styles.button}>
        <Button title='Add Installation' onPress={saveInstallation}></Button>
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
