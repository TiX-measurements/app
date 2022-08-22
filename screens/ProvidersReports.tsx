import React, { useEffect, useState } from "react";
import { View, ScrollView } from '../components/Themed';
import { StyleSheet, Pressable, Button } from 'react-native';
import { Report, ProviderData } from "../types";
import ProviderReport from "../components/ProviderReport";
import { getProvidersReport } from "../helpers/measurements";
import { getProviders } from "../helpers/provider";
import { createMessageAlert } from "../helpers/Alerts";
import { AlertMessages, AlertTitles } from "../constants/Config";

export default function ProvidersReports() {

    let reportInit:Report = {
      upUsage: 100,
      downUsage: 30,
      upQuality: 20,
      downQuality: 10,
      timestamp: '',
      location_id: 0,
      provider_id: 0,
      user_id: 0,
    };

    const [providersReport, setReports] = useState<Report[]>([reportInit]);
    const [providers, setProviders] = useState<ProviderData[]>();

    async function getReports() {
      const reports = await getProvidersReport();
      if (reports.data) {
        if(reports.data.length === 0) {
          return
        }
        setReports(reports.data)
      }
      else{
        createMessageAlert(AlertTitles.error, reports.error?reports.error.reason:AlertMessages.unexpected)
      } 
    }

    async function getProvider() {
      const providers = await getProviders();
      if (providers.data) {
        setProviders(providers.data)
      }
      else{
        createMessageAlert(AlertTitles.error, providers.error?providers.error.reason:AlertMessages.unexpected)
      }
    }

    useEffect(() => {
        getReports()
        getProvider()
        }, [])
    
    let getName = (providerId : number) => {
      let provider = providers?.find(provider => provider.id === providerId)
      return provider ? provider.name :"Unknown"
    }
    let reports = providersReport.map((report,i)=>{
      return <ProviderReport data={report} name={getName(report.provider_id)} key={'repor_'+i.toString()}/>
    }
    );
      return (
        <View style={styles.container}>
          <ScrollView>
            {reports}
          </ScrollView>
          <Button title='Update' onPress={getReports}></Button>
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
      