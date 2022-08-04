import * as WebBrowser from 'expo-web-browser';
import { StyleSheet, Dimensions } from 'react-native';

import Colors from '../constants/Colors';
import { MonoText } from './StyledText';
import { Text, View, ScrollView } from './Themed';
import { useState, useEffect } from 'react';

import { LineChart } from "react-native-chart-kit";
import { DataReports, Report } from '../types'

export default function Results(props:{data:DataReports} ) {

  const config = {
    backgroundColor: "#e26a00",
    backgroundGradientFrom: "#fb8c00",
    backgroundGradientTo: "#ffa726",
    decimalPlaces: 2, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#ffa726"
    }
  }
  return (
        <View style={styles.getStartedContainer}>
          <View style = {styles.metric}>
          <Text
            style={styles.getStartedText}
            lightColor="rgba(0,0,0,0.8)"
            darkColor="rgba(255,255,255,0.8)">
            Up
          </Text>
              <LineChart
                data={{
                  labels:[],
                  datasets: [{data: props.data.upUsageData, color:(opacity = 1) => `rgba(255, 255, 0, ${opacity})`},{data: props.data.upQualityData} ],
                  legend: ["Usage data", "Quality data"] 
                }}
                width={Dimensions.get("window").width*0.9}
                height={220}
                yAxisLabel="%"
                yAxisInterval={1} // optional, defaults to 1
                chartConfig={config}
                bezier
                style={{
                  marginVertical: 8,
                  borderRadius: 16
                }}
                
              />
              </View>
          <View style = {styles.metric}>    
          <Text
            style={styles.getStartedText}
            lightColor="rgba(0,0,0,0.8)"
            darkColor="rgba(255,255,255,0.8)">
            Down
          </Text>    
              <LineChart
                data={{
                  labels:[],//props.data.dates,
                  datasets: [{data: props.data.downUsageData, color:(opacity = 1) => `rgba(255, 255, 0, ${opacity})`}, {data: props.data.downQualityData} ],
                  legend: ["Usage data", "Quality data"] 
                }}
                width={Dimensions.get("window").width*0.9}
                height={220}
                yAxisLabel="%"
                yAxisInterval={1} // optional, defaults to 1
                chartConfig={config}
                bezier
                style={{
                  marginVertical: 8,
                  borderRadius: 16
                }}
              />
              </View>
        </View>
  );
}

const styles = StyleSheet.create({
  getStartedContainer: {
    flexDirection: 'column',
    //alignContent:'space-around',
    alignItems: 'center',
    justifyContent: 'space-around',
    //backgroundColor:'red',
    marginVertical: 10,
    //height:'100%'
  },
  metric:{
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  getStartedText: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'left',
  },
});
