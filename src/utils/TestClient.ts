// require("request-promise").debug = true;
import * as rp from "request-promise";

export class TestClient {
  url: string;
  options: {
    jar: any;
    withCredentials: boolean;
    json: boolean;
    headers: any;
  };
  constructor(url: string) {
    this.url = url;
    this.options = {
      withCredentials: true,
      jar: rp.jar(),
      json: true,
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    };
  }

  async register(email: string, password: string) {
    return rp.post(this.url, {
      ...this.options,
      body: {
        query: `
          mutation {
            register(email: "${email}" password: "${password}") {
              path
              message
            }
          }
        `
      }
    });
  }

  async logout() {
    return rp.post(this.url, {
      ...this.options,
      body: {
        query: `
            mutation {
                logout
            }
                `
      }
    });
  }

  async forgotPasswordChange(newPassword: string, key: string) {
    return rp.post(this.url, {
      ...this.options,
      body: {
        query: `
               mutation {
                forgotPasswordChange(newPassword: "${newPassword}" key: "${key}") {
                        path
                        message
                    }
                }
            `
      }
    });
  }

  async me() {
    return rp.post(this.url, {
      ...this.options,
      body: {
        query: `
               {
                    me{
                        id
                        email
                    }
                }
            `
      }
    });
  }

  async login(email: string, password: string) {
    return rp.post(this.url, {
      ...this.options,
      body: {
        query: `
            mutation {
                login(email: "${email}" password:"${password}") {
                    path
                    message
                }
            }
            `
      }
    });
  }
}
