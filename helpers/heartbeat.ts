import UdpSocket from "react-native-udp/lib/types/UdpSocket";
import BackgroundFetch from "react-native-background-fetch";
import { Config } from "../constants/Config";
import * as Network from 'expo-network';

export const sendHeartBeat = async (socket: UdpSocket) => {
    let packet = new Uint8Array(2);

    let state = await Network.getNetworkStateAsync();

    if(state.isConnected && state.type === Network.NetworkStateType.WIFI){
      socket.send(packet, 0, 2, Config.sources.clientTriggerPort, Config.sources.ClientTriggerAddress, function(err) {
          if (err) console.log('Error sending hearbeat: ', err)
      })
    }
}

export const initBackgroudHearBeat = async (socket: UdpSocket) => {
    // BackgroundFetch event handler.
    const onEvent = async (taskId: any) => {
      console.log('[BackgroundFetch] event: ', taskId);
      
      sendHeartBeat(socket);
      // IMPORTANT:  You must signal to the OS that your task is complete.
      BackgroundFetch.finish(taskId);
    }

    // Timeout callback is executed when your Task has exceeded its allowed running-time.
    // You must stop what you're doing immediately BackgroundFetch.finish(taskId)
    const onTimeout = async (taskId: any) => {
      console.warn('[BackgroundFetch] TIMEOUT task: ', taskId);
      BackgroundFetch.finish(taskId);
    }

    // Initialize BackgroundFetch only once when component mounts.
    let status = await BackgroundFetch.configure(
      {
        minimumFetchInterval: 15,
        stopOnTerminate: false,
        startOnBoot: true,
        forceAlarmManager: true
      }, 
      onEvent, 
      onTimeout);

  }