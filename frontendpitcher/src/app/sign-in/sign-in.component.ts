import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/userservice/user.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../shared/userservice/user.model';
import { CookieService } from "ngx-cookie-service";
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  errormessages: string;
  udata;
  constructor(public userService: UserService, public router: Router, public cookieService: CookieService) { }
  model = {
    email: '',
    password: ''
  }


  ngOnInit() {

    if (this.cookieService.get("udata")) {
      this.udata = JSON.parse(this.cookieService.get("udata"));
      this.router.navigateByUrl('/userpitchers')
    }
  }
  //after user submits the signin form
  async onSubmit(form: NgForm) {

    const userdata = <JSON>await this.userService.login(form.value);

    // this.userService.setToken(userdata['accessToken']);
    this.router.navigateByUrl('/userpitchers');
  }

  async signingoogle() {
    const value = <JSON>await this.userService.signwithgoogle()
    this.userService.setUser(value);
    this.router.navigateByUrl('/userpitchers');

  }

}
