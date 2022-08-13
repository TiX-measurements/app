import { Alert } from "react-native";


const createMessageAlert = (title:string, message:string) =>
    Alert.alert(
        title,
        message,
      [
        { text: "OK" }
      ]
    );

export {createMessageAlert}