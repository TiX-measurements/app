import dgram from 'react-native-udp';
import UdpSocket from 'react-native-udp/lib/types/UdpSocket';


export const setUpSocket = (port: number, responseHandler: Function): UdpSocket => {
    let socket = dgram.createSocket({
        type: 'udp4',
    });
    socket.bind(port);
    socket.on('message', function(msg, receInfo) {
        responseHandler(msg, receInfo);
    })

    return socket;
}