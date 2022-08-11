import UdpSocket from "react-native-udp/lib/types/UdpSocket";
import { Config } from "../constants/Config";
import { get8BitArrayBinaryFrom } from "./parser";
import { getTimestampInNanos } from "./timestamps";
import { NativeModules } from 'react-native';
const { TimestampModule } = NativeModules;


export const sendInitialPacket = (socket: UdpSocket) => {
    const packet = buildInitialPacket();
    // console.log(`Sending packet: ${packet}`);

    socket.send(packet, 0, 32, Config.sources.timeServerPort, Config.sources.timeServerAddress, function(err) {
        if (err) console.log(err)
    })
}

export function buildInitialPacket(): Uint8Array {
    let packet = new Uint8Array(32); // 4 numbers of 8 bytes ---> 32 entries of 8 bits

    const timestamp = TimestampModule.getTimestamp();
    setTimeOnPacket(timestamp, packet, 0);

    return packet;
}

export const parseFromPacket = (msg: any, position: number, bytes: number): number => {
    const arr = Uint8Array.from(msg)

    let binaryString = "";
    for(let i = position * bytes; i < position * bytes + bytes; i++){
        binaryString += arr[i].toString(2).padStart(8, '0')
    }

    return parseInt(binaryString, 2);
}

export const setTimeOnPacket = (timestamp: number, packet: Uint8Array, position: number) => {
    const bitArray = get8BitArrayBinaryFrom(timestamp, 8);
    for (let i = position * 8; i < position * 8 + 8; i++) {
        packet[i] = bitArray[i - position * 8];
    }

    return packet;
}

export const completePacket = (msg: any): Uint8Array => {
    let packet = Uint8Array.from(msg)
    const timestamp = TimestampModule.getTimestamp();
    setTimeOnPacket(timestamp, packet, 3);
    return packet;
}

