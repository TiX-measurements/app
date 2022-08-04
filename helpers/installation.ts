import { AlertMessages, Config } from "../constants/Config";
import { ErrorResponse, Installation, InstallationData } from "../types";
import { get } from "./storage";
import Url from "./url";

export function getInstallationNames(installations: InstallationData[]):string[] {
  return installations.map((i) => i.name);
}

export async function getInstallations(): Promise<Installation> {
  const userId = (await get('id'))?.toString() ?? "";
  const token = await get('token');
  return new Url(Config.sources.backend).Get(Config.resources.getInstallation(userId),{ Authorization: 'JWT ' + token })
  .then(async (response) => {
      if (response.ok){
        const result: InstallationData[] = (await response.json());
        return {
          data: result,
        }
      }
      else if (response.status === 401) {
        const result:ErrorResponse = await response.json();
        return {
          error: result,
        }
      }
      else {
        const result:ErrorResponse = {reason: AlertMessages.login};
        return {
          error: result,
        }
      }
    })
    .catch((e)=>{
      const result:ErrorResponse = {reason: AlertMessages.connection};
        return {
          error: result,
        }
  })
}