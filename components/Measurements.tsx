import { StyleSheet, TouchableOpacity, Button, NativeModules } from 'react-native';
import { MonoText } from './StyledText';
import { Text, View } from './Themed';
import React, { useState, useEffect } from 'react';
import UdpSocket from 'react-native-udp/lib/types/UdpSocket';
import { completePacket, parseFromPacket, sendInitialPacket } from '../helpers/smallPackets';
import { setUpSocket } from '../helpers/socket';
import { initBackgroudHearBeat, sendHeartBeat } from '../helpers/heartbeat';
import { sendBigPacket } from '../helpers/bigPackets';
import { Config } from '../constants/Config';
import { getTimestamp } from '../helpers/timestamps';
import { generateKeyPair } from '../helpers/crypto';

let socket: UdpSocket;

let packetCounter = 0;
let packets: {
  data: Uint8Array,
  timestamp: number
}[] = [];


export default function Measurements() {
    const [measuring, setMeasuring] = useState(false);
    let timeoutMeasuring: NodeJS.Timeout;

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
        // console.log(`${new Date().toISOString()}: Completed: ${packet}`)

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
        if(!socket){
            socket = setUpSocket(Config.app.udpPort, messageHandler);            
            socket.once('listening', function() {
              setMeasuring(true);
              sendHeartBeat(socket);
              sendInitialPacket(socket);
            });
        }
        
        initBackgroudHearBeat(socket);
    }, []);

    return (
        <View>
          <View style={styles.textContainer}>
          
            <View style={styles.getStartedContainer}>
                <Text
                lightColor="rgba(0,0,0,0.8)"
                darkColor="rgba(255,255,255,0.8)">
                Measuring status: <Text style={styles.boldText}>{measuring ? 'Measuring' : 'Not measuring'}</Text>
                </Text>
                
            </View>
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
});