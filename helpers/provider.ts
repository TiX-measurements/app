import { AlertMessages, Config } from "../constants/Config";
import { ErrorResponse, ProviderData, Provider } from "../types";
import { get } from "./storage";
import Url from "./url";

export function getProvidersNames(installations: ProviderData[]):string[] {
    return installations.map((i) => i.name);
  }

export async function getProviders(): Promise<Provider> {
    const userId = (await get('id'))?.toString() ?? "";
    const token = await get('token');

    return new Url(Config.sources.backend).Get(Config.resources.getProvider(userId), { Authorization: 'JWT ' + token })
    .then(async (response) => {
      const result: ProviderData[] = await response.json();
      console.log(result)

      if (response.ok){
        return {
          data: result,
        }
      }

      return {
        data: []
      }
    }).catch((e) => {
      const result:ErrorResponse = { reason: e.message };
        return {
          error: result,
        }
    })
  }