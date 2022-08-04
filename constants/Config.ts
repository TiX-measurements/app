const Config =
{
    sources: {
        backend: 'http://10.0.2.2:3001',
        timeServerAddress: '10.0.2.2',
        ClientTriggerAddress: '10.0.2.2',
        timeServerPort: 4501,
        clientTriggerPort: 7561
    },
    app: {
        udpPort: 12345
    },
    resources: {
        login: '/api/login',
        signup: '/api/register',
        addInstallation: (id:string):string=>{return '/api/user/'+id+'/installation'},
        getInstallation: (id:string):string=>{return '/api/user/'+id+'/installation'},
        getProvider: (id:string):string=>{return '/api/user/'+id+'/provider'},
        getProvidersReports: (id:string):string=>{return '/api/user/'+id+'/reports'},
        getReports: (uId:string,iId:string,pId:string,iDate:string, eDate:string):string=>{
            console.log('endpoint', '/api/user/'+uId+'/reports?installationId='+iId+'&providerId='+pId+'&startDate='+iDate+'&endDate='+eDate)
            return '/api/user/'+uId+'/reports?installationId='+iId+'&providerId='+pId+'&startDate='+iDate+'&endDate='+eDate
        },
    },
    heartbeatFrecuency: 30, // Send heartbeat every X packets received
    triggerServerPacket: 30049,
    bigPacketSize: 10
}

const AlertMessages =
{
    login: 'Wrong username or password',
    signup: 'Verify Data',
    connection: 'Connection error',
    unexpected: 'Unexpected error',
    provider: 'Select your provider',
    emptyField: 'Empty field',

}

const AlertTitles =
{
    error: 'Error',
    info: "Information",
}

export { Config, AlertMessages, AlertTitles }