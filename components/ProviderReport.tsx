import { StyleSheet, Dimensions } from 'react-native';
import { Text, View } from './Themed';

import { BarChart } from "react-native-chart-kit";
import { Report } from '../types'
import { useEffect, useState } from 'react';

export default function ProviderReport(props:{data:Report, name:string} ) {

  const [data, setdata] = useState<Report>(props.data);

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
  useEffect(() => {
    setdata(props.data)
    }, [])
  return (
        <View style={styles.getStartedContainer}>    
          <Text
            style={styles.getStartedText}
            lightColor="rgba(0,0,0,0.8)"
            darkColor="rgba(255,255,255,0.8)">
            {props.name}
          </Text>    
              <BarChart
                data={{
                  labels:['Down Usage','Down Quality','Up Usage','Up Quality'],//props.data.dates,
                  datasets: [{data:[data.downUsage, data.downQuality, data.upUsage, data.upQuality]}]
                }}
                width={Dimensions.get("window").width*0.9}
                height={220}
                yAxisLabel=""
                yAxisSuffix='%'
                yAxisInterval={1} // optional, defaults to 1
                chartConfig={config}
                style={{
                  margin: 10,
                  borderRadius: 16
                }}
              />
        </View>
  );
}

const styles = StyleSheet.create({
  getStartedContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor:'#BAE8E7',
    borderRadius:30,
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
