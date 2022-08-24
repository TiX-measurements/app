import { StyleSheet, TouchableOpacity, Button, NativeModules, AppState, AppRegistry } from 'react-native';
import { MonoText } from './StyledText';
import { Text, View } from './Themed';
import React, { useState, useEffect, useRef } from 'react';
import UdpSocket from 'react-native-udp/lib/types/UdpSocket';
import { completePacket, parseFromPacket, sendInitialPacket } from '../helpers/smallPackets';
import { setUpSocket } from '../helpers/socket';
import { initBackgroudHearBeat, sendHeartBeat } from '../helpers/heartbeat';
import { sendBigPacket } from '../helpers/bigPackets';
import { Config } from '../constants/Config';
import { getTimestamp } from '../helpers/timestamps';
import { generateKeyPair } from '../helpers/crypto';
const { Heartbeat } = NativeModules;


let socket: UdpSocket;

let packetCounter = 0;
let packets: {
  data: Uint8Array,
  timestamp: number
}[] = [];
let timeoutMeasuring: NodeJS.Timeout;

export const MyHeadlessTask = async () => {
  console.log('Receiving HeartBeat!');
  if (socket){
    sendHeartBeat(socket);
  }
};



export default function Measurements() {
    const appState = useRef(AppState.currentState);

    const [measuring, setMeasuring] = useState(false);
    const [cpacketCounter, setPacketCounter] = useState(0);
    const [heartbeatState, setHeartbeatState] = useState(true);

    const toggleHearbeatService = () => {
      if (heartbeatState) {
        Heartbeat.stopService();
      } else {
        Heartbeat.startService();
      }

      setHeartbeatState(!heartbeatState);
    }
 
    const messageHandler = (msg: any, receInfo: any) => {
        clearTimeout(timeoutMeasuring);
        if(msg.length > 32){
          return;
        }
        const res0 = parseFromPacket(msg, 0, 2);
        if(res0 === Config.triggerServerPacket) {
            setMeasuring(true);
            sendInitialPacket(socket);
            return;
        }

        if(packetCounter % Config.heartbeatFrecuency === 0){
            packetCounter = 0;
            sendHeartBeat(socket);
        }

        const packet = completePacket(msg);
        console.log(`${new Date().toISOString()}: Completed: ${packet}`)
        setPacketCounter(packetCounter)

        packets.push({ data: packet, timestamp: getTimestamp() });
        
        if(packets.length && packets.length % Config.bigPacketSize === 0){
            sendBigPacket(socket, packets);
            packets = [];
        }

        timeoutMeasuring = setTimeout(() => {
          setMeasuring(false)
        }, 5000);
        packetCounter++;
    }

    useEffect(() => {
        setUp();
        
        const subscription = AppState.addEventListener("change", nextAppState => {
          appState.current = nextAppState;

          setUp();
          initBackgroudHearBeat(socket);
        });
    
        initBackgroudHearBeat(socket);

        Heartbeat.startService();

        return () => {
          subscription.remove();
        };
    }, []);

    const setUp = () => {
      if(!socket){
        socket = setUpSocket(Config.app.udpPort, messageHandler);            
        socket.once('listening', function() {
          setMeasuring(true);
        });
      }
      
      sendHeartBeat(socket);

      setTimeout(() => {
        sendHeartBeat(socket);
      }, 5000)
    }

    return (
        <View>
          <View style={styles.textContainer}>
          
            <View style={styles.getStartedContainer}>
                <Text
                lightColor="rgba(0,0,0,0.8)"
                darkColor="rgba(255,255,255,0.8)">
                Measuring status: <Text style={styles.boldText}>{measuring ? 'Measuring' : 'Not measuring'}</Text>
                </Text>
                <Text
                lightColor="rgba(0,0,0,0.8)"
                darkColor="rgba(255,255,255,0.8)">
                Packets collected: {cpacketCounter}
                </Text>
            </View>
          </View>

          <View style={styles.inputs}>
            {
              heartbeatState ?
              <Button title='Pause background processing' onPress={() => toggleHearbeatService()} ></Button>
              :
              <Button title='Restart background processing' onPress={() => toggleHearbeatService()} ></Button>
            }
          </View>
        </View>
    );
}

const styles = StyleSheet.create({
  getStartedContainer: {
  },
  helpLink: {
    paddingVertical: 15,
  },
  textContainer: {
    marginBottom: 15,
  },
  boldText: {
    fontWeight: 'bold',
  },
  button: {
    marginBottom: 15,
  },
  separator: {
    marginVertical: 5,
    height: 1,
    width: '80%',
  },
  inputs: {
    alignItems: 'stretch',
    justifyContent: 'space-between',
    flexDirection: 'column'
  }
});