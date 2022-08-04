import { StyleSheet } from 'react-native';

import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import Measurements from '../components/Measurements';
import { useEffect, useState } from 'react';
import { get } from '../helpers/storage';

export default function MeasurementsTabScreen({ navigation }: RootTabScreenProps<'TabOne'>) {

  const [user, setUser] = useState('');
  const [installation, setInstallation] = useState('');

  useEffect(() => {
    const getData = async () => {
      let username = await get('username')
      setUser(username);
      let userId = await get('id')
      let installation = await get(`${userId}_installationName`);
      setInstallation(installation);
    }

    getData();
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        User: {user}
      </Text>
      <Text style={styles.title}>
        Installation: {installation}
      </Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Measurements />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 10,
    marginTop: 10,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  title: {
    paddingTop: 5
  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: '80%',
  },
});
