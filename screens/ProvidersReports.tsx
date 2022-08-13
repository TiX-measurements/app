import React, { useEffect, useState } from "react";
import { Text, View, ScrollView } from '../components/Themed';
import { StyleSheet, Pressable } from 'react-native';
import { Report } from "../types";
import ProviderReport from "../components/ProviderReport";
import { getProvidersReport } from "../helpers/measurements";
import { createMessageAlert } from "../helpers/Alerts";
import { AlertMessages, AlertTitles } from "../constants/Config";

export default function ProvidersReports() {

    const reportInit:Report = {
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

    useEffect(() => {
        getReports()
        }, [])
      
    let reports = providersReport.map((report,i)=>{return <ProviderReport data={report} name="test" key={'repor_'+i.toString()}/>});
      return (
        <View style={styles.container}>
          <ScrollView>
            {reports}
          </ScrollView>
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
      