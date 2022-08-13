import { Report, ErrorResponse, DataReports, Measurements, ProvidersReports } from '../types'
import { get, save } from '../helpers/storage';
import Url from '../helpers/url'
import { AlertMessages, Config } from '../constants/Config'

 function dataParser(results: Report[]):DataReports  {
    let dates:string[] = [""];
  
    let upUsage:number[] = [0] ;
    let downUsage:number[] = [0];
    let upQuality:number[] = [0];
    let downQuality:number[] = [0];
  
    results.map((result) => {
      dates.push(result.timestamp.slice(8,10));
      upUsage.push(result.upUsage*100);
      downUsage.push(result.downUsage*100);
      upQuality.push(result.upQuality*100);
      downQuality.push(result.downQuality*100);
      }
    )
    return {
      
          dates: dates,
          upUsageData: upUsage,
          downUsageData: downUsage,
          upQualityData: upQuality,
          downQualityData: downQuality,
        
    }
  }

let getStringDate = (date: Date)=> {
  return date.getFullYear().toString()+'-'+(date.getMonth()+1).toString()+'-'+date.getDate().toString()
}; 

export async function getMeasurements(installationId:string, providerId:string,selectedDate: Date, ):Promise<Measurements> {
    const userId = (await get('id'))?.toString() ?? "";
    const token = await get('token');
    const initialDate = getStringDate(selectedDate);
    const endDate = getStringDate(selectedDate);
    return new Url(Config.sources.backend).Get(Config.resources.getReports(userId as string,installationId,providerId,initialDate,endDate),{Authorization: 'JWT '+ token})
      .then(async (response) => {
        if (response.ok){
          const result:Report[] = await response.json()
          const data = dataParser(result);
          return {
            data : data,
          }
        } 
        else if (response.status === 401) {
          const result:ErrorResponse = (await response.json());
          return{
              error: result
          }
        }
        else {
          const result:ErrorResponse = {reason: AlertMessages.login};
          return{
              error: result
          }
        }
      })
      .catch((e)=>{
          const result:ErrorResponse = {reason: AlertMessages.connection};
          return{
              error: result
          }
      })
}

export async function getProvidersReport( ):Promise<ProvidersReports> {
    const userId = (await get('id'))?.toString() ?? "";
    const token = await get('token');
    return new Url(Config.sources.backend).Get(Config.resources.getProvidersReports(userId as string),{Authorization: 'JWT '+ token})
      .then(async (response) => {
        if (response.ok){
          const result:Report[] = await response.json()
          //const data = dataParser(result);
          return {
            data : result,
          }
        } 
        else if (response.status === 401) {
          const result:ErrorResponse = (await response.json());
          return{
              error: result
          }
        }
        else {
          const result:ErrorResponse = {reason: AlertMessages.login};
          return{
              error: result
          }
        }
      })
      .catch((e)=>{
          const result:ErrorResponse = {reason: AlertMessages.connection};
          return{
              error: result
          }
      })
}
