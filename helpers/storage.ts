import * as SecureStore from 'expo-secure-store';

export async function save(key: string, value: string) {
    await SecureStore.setItemAsync(key, value);
  }
export async function get(key: string): Promise<string> {
    let result = await SecureStore.getItemAsync(key);
    return result?.toString() ?? "";
}