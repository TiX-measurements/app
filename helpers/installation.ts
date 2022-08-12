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
    const result: InstallationData[] = (await response.json());
    if (response.ok) {
      return {
        data: result,
      }
    } 

    return {
      data: []
    }
  }).catch((e)=>{
      console.log(e)
      const result:ErrorResponse = { reason: e.message };
      return {
        error: result,
      }
  })
}