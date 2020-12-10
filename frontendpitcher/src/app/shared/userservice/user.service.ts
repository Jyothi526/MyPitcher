import { Injectable, Type } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import user model class
import { User } from './user.model';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { CookieService } from "ngx-cookie-service";
//import { variable } from '@angular/compiler/src/output/output_ast';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  udata: JSON;
  selectedUser: User = {
    name: '',
    email: '',
    password: '',
    googleid: '',
    verified: false,
    resetLink: '',
    accessToken: ''
  };


  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };
  constructor(public http: HttpClient,
    public router: Router,
    private cookieService: CookieService) { }

  //user details saved with mail verification
  postUser(user: User) {
    console.log(user);
    return this.http.post(environment.apiBaseUrl + '/user/signup', user, this.noAuthHeader);
  }
  //login with authentication
  login(formData: FormData) {
    console.log(formData);
    if (this.cookieService.getAll()) {
      this.cookieService.deleteAll();
    }
    return new Promise((resolve) => {
      this.http.post(environment.apiBaseUrl + "/user/authenticate", formData, this.noAuthHeader).subscribe((data) => {
        this.cookieService.set("udata", JSON.stringify(data));
        this.setUser(data);
        console.log("udata is:", data);
        resolve(data);
      });
    });

  }
  setUser(user) {
    this.udata = user;
    console.log("setUser Method is being called", this.udata)
  }

  signwithgoogle() {
    if (this.cookieService.getAll()) {
      this.cookieService.deleteAll();
    }
    return new Promise((resolve) => {
      window.open(environment.apiBaseUrl + '/auth/google', "mywindow", "location=1,status=1,scrollbars=1, width=800,height=800");
      let listener = window.addEventListener('message', (message) => {
        console.log("response from node: ", message.data)
        this.setUser(message.data.user);
        if (message.data.user) {
          this.cookieService.set("udata", JSON.stringify(this.udata));
          resolve(this.udata);
        }
      })
    })

  }
  Forgotpassword(email) {
    return this.http.post(environment.apiBaseUrl + '/user/forgot', email);
  }
  sendtoken(token) {
    return this.http.get(environment.apiBaseUrl + `/user/forgot/${token}`);
  }
  resetpassword(passwords, id) {
    return this.http.post(environment.apiBaseUrl + `/user/reset/${id}`, passwords);
  }
  sendtokentogetusermail() {
    return this.http.get(environment.apiBaseUrl + '/user/userprofile');
  }
  getCurrUser() {
    return this.udata;
  }

  logout() {
    console.log("logout method is called");
    this.cookieService.deleteAll();
    return new Promise((resolve) => {
      this.http.get(environment.apiBaseUrl + "/auth/logout", this.noAuthHeader).subscribe((data) => {
        console.log("logged out request data is:");
        resolve(data);
      });
    });

  }
}