import { RSAKeychain } from 'react-native-rsa-native';
import { Buffer } from 'buffer'

export function toBase64(input: any) {
  return Buffer.from(input, 'utf-8').toString('base64')
}

export function fromBase64(encoded: any) {
  return Buffer.from(encoded, 'base64');
}

export const pemToDer = (key: string): Uint8Array => {
    let res = pemToDer64(key);
    return fromBase64(res);
}

export const pemToDer64 = (key: string): string => {
  var prefix = '-----BEGIN RSA PUBLIC KEY-----';
  var postfix = '-----END RSA PUBLIC KEY-----'; // PKCS1

  key = key.replace(prefix, "");
  key = key.replace(postfix, "");

  // https://stackoverflow.com/questions/18039401/how-can-i-transform-between-the-two-styles-of-public-key-format-one-begin-rsa
  let header = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A"; 
  key = key.split("\n").join('').trim();

  return header + key;
}
  
export const generateKeyPair = async (keyTag : string): Promise<string> => {
    let keys = await RSAKeychain.generate(keyTag);
    return keys.public;
}

export const signData = (data: Uint8Array, keyTag: string) => {
  return RSAKeychain.sign64WithAlgorithm(toBase64(data), keyTag, 'SHA1withRSA');
}