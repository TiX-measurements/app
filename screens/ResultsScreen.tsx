import { StyleSheet, Pressable } from 'react-native';

import { Text, View, ScrollView } from '../components/Themed';
import Results from '../components/Results';
import { useState, useEffect } from 'react';
import { createMessageAlert } from '../helpers/Alerts'
import { AlertMessages, AlertTitles } from '../constants/Config'
import { DataReports, InstallationData, ProviderData } from '../types'
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import SelectDropdown from 'react-native-select-dropdown'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { get, save } from '../helpers/storage';
import { getMeasurements } from '../helpers/measurements';
import { getInstallationNames, getInstallations } from '../helpers/installation';
import { getProviders, getProvidersNames } from '../helpers/provider';

export default function ResultsScreen() {

  const reportInit:DataReports = {
    dates: [""],
    upUsageData: [0],
    downUsageData: [0],
    upQualityData: [0],
    downQualityData: [0],
  };

  const [results, setResults] = useState(reportInit);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [installations, setInstallations] = useState<InstallationData[]>([]);
  const [SelectedInstallation, setInstallation] = useState<string>('');
  const [providers, setProviders] = useState<ProviderData[]>([]);
  const [SelectedProvider, setProvider] = useState<string>('');  

  const onChange = (event:DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate as Date;
    setShow(false);
    setDate(currentDate);
    getReports(currentDate, SelectedInstallation, SelectedProvider);
  };

  const showDatepicker = () => {
    setShow(true);
  };

  async function getReports(selectedDate: Date, installation:string, providerId:string) {
    const installationId = installation === ''?installations[0].id.toString(): installation;
    if (providerId === '') {
      createMessageAlert(AlertTitles.info, AlertMessages.provider)
      return
    }
    const measurements = await getMeasurements(installationId, providerId, selectedDate)
    if (measurements.data){
      setResults(measurements.data)
    }
    else {
      createMessageAlert(AlertTitles.error, measurements.error?measurements.error.reason:AlertMessages.unexpected)
    }
  }
  
  async function getInstallation() {
    const installations = await getInstallations();
    if (installations.data) {
      setInstallations(installations.data)
    }
    else{
      createMessageAlert(AlertTitles.error, installations.error?installations.error.reason:AlertMessages.unexpected)
    }
  }

  async function getProvider() {
    const providers = await getProviders();
    if (providers.data) {
      setProviders(providers.data)
      if (providers.data.length === 1) setProvider(providers.data[0].id.toString())
    }
    else{
      createMessageAlert(AlertTitles.error, providers.error?providers.error.reason:AlertMessages.unexpected)
    }
  }

  useEffect(() => {
    getInstallation()
    getProvider()
    }, [])

  return (
    <View style={styles.container}>
      <View style={styles.selectorsContainer}>
      <SelectDropdown buttonStyle = {styles.selector}
	      defaultButtonText= 'Installation'
        data={
          getInstallationNames(installations)
        }
	      onSelect={(selectedItem, index) => {
          const installationSelected = installations[index].id.toString();
          setInstallation(installationSelected);
          save("installation", installationSelected);

          getReports(date, installationSelected, SelectedProvider);
	      }}
	      buttonTextAfterSelection={(selectedItem, index) => {
	      	return selectedItem
	      }}
	      rowTextForSelection={(item, index) => {
	      	return item
	      }}
      />

      <SelectDropdown buttonStyle = {styles.selector}
      defaultButtonText= 'Provider'
	      data={
          getProvidersNames(providers)
        }
	      onSelect={(selectedItem, index) => {
          const providerSelected = providers[index].id.toString();
          setProvider(providerSelected);
          //save("installation", installationSelected.id.toString());

          getReports(date, SelectedInstallation, providerSelected);
	      }}
	      buttonTextAfterSelection={(selectedItem, index) => {
	      	return selectedItem
	      }}
	      rowTextForSelection={(item, index) => {
	      	return item
	      }}
      />
      </View>
      <ScrollView>
        <Results data={results}/>
      </ScrollView>
      <Pressable onPress={showDatepicker} style={styles.dateSelector} >
        <Text style={styles.icon}>
        <Icon name="event" size={40} color='white' />;
        </Text>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode='date'
            is24Hour={true}
            onChange={onChange}
          />
        )}
      </Pressable>  
    </View>
  );
}
//
const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  },
  header: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#EFEFEF',
  },
  selectorsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width:'100%',
    justifyContent: 'space-around',
    backgroundColor: '#BAE8E7',
  },
  dateSelector: {
    //marginVertical: 20,
    width: 60,  
    height: 60,   
    borderRadius: 30,            
    backgroundColor: '#66CCCC',                                    
    position: 'absolute',                                          
    bottom: 15,                                                    
    right: 15,
    
  },
  selector: {
    margin:10,
    borderRadius: 20,
    width:'40%',
    backgroundColor: '#FFCC00'
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: 'lightgrey'
  },
  icon:{
    position: 'absolute',                                          
    bottom: 5,                                                    
    right: 7,
    
  }
});
