import { fromBase64, generateKeyPair, pemToDer, signData, toBase64 } from "./crypto";
import { get8BitArrayBinaryFrom } from "./parser";
import { get } from "./storage";
import { Buffer } from 'buffer'
import UdpSocket from "react-native-udp/lib/types/UdpSocket";
import { Config } from "../constants/Config";

export const sendBigPacket = async (socket: UdpSocket, packets: {
    data: Uint8Array,
    timestamp: number
  }[]) => {
    const userId = await get("id");
    const installationId = await get(userId);

    let data: Uint8Array = new Uint8Array(0);
    packets.forEach(p => {
        data = concatArrays(data, get8BitArrayBinaryFrom(p.timestamp, 8));
        data = concatArrays(data, new Uint8Array(Buffer.from("S").buffer));
        data = concatArrays(data, get8BitArrayBinaryFrom(32, 4));
        data = concatArrays(data, p.data);
    });

    // Signature
    const pubKey = await get(`${userId}_pubkey`);
    const signature = fromBase64(await signData(data, `${userId}_tix.app`));

    let result: Uint8Array = new Uint8Array(0);
    result = concatArrays(result, packets[packets.length - 1].data);
    result = concatArrays(result, new Uint8Array(Buffer.from("DATA;;").buffer));
    result = concatArrays(result, get8BitArrayBinaryFrom(Number(userId), 8));
    result = concatArrays(result, get8BitArrayBinaryFrom(Number(installationId), 8));
    result = concatArrays(result, new Uint8Array(Buffer.from(";;").buffer));
    result = concatArrays(result, new Uint8Array(pemToDer(pubKey).buffer));
    result = concatArrays(result, new Uint8Array(Buffer.from(";;").buffer));
    result = concatArrays(result, new Uint8Array(Buffer.from(toBase64(data)).buffer));
    result = concatArrays(result, new Uint8Array(Buffer.from(";;").buffer));
    result = concatArrays(result, new Uint8Array(signature));
    result = concatArrays(result, new Uint8Array(Buffer.from(";;").buffer));

    console.log('Sending big packet...');
    socket.send(result, 0, result.length, Config.sources.timeServerPort, Config.sources.timeServerAddress, function(err) {
        if (err) console.log(err)
    })
}



const concatArrays = (array1: Uint8Array, array2: Uint8Array) => {
    let mergedArray = new Uint8Array(array1.length + array2.length);
    mergedArray.set(array1);
    mergedArray.set(array2, array1.length);
    return mergedArray
}