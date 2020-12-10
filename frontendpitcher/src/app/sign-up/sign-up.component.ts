import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

// importing service classe
import { UserService } from '../shared/userservice/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  mailverification: string;
  verified: false;
  constructor(public userService: UserService, public router: Router) { }

  ngOnInit(): void {
  }
  //when user submits signup form 
  onSubmit(form: NgForm) {
    this.userService.postUser(form.value).subscribe(
      res => {
        console.log(res);
      },
      err => {
        if (err.status == 422) {
          this.mailverification = err.error.join('<br>');
        }
        else {
          this.mailverification = 'Mail sent, click the link to activate';
        }
      }
    )
  }




}
