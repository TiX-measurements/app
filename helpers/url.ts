class Url {
    url: string;
    constructor(url:string) {
      this.url = url;
    }
    Get(resource:string, headers:object = {}) {
        return fetch(this.url + resource, {
            headers: { ...headers },
        });
    }

    Post(resource:string, body?:object, headers?:object) {
        return fetch(this.url + resource, {
            method: 'POST',
            headers: {... headers,          
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
    }
  }

  export default Url