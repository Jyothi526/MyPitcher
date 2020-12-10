import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/userservice/user.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent implements OnInit {
  model = {
    email: '',
  }

  constructor(public userService: UserService,) { }

  ngOnInit(): void {
  }
  onSubmit(form: NgForm) {
    this.userService.Forgotpassword(form.value).subscribe(
      res => {
        alert(res[0].msg);
      },
    )

  }

}
