import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, RouterLink } from '@angular/router';
import { UserService } from '../shared/userservice/user.service';

import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.scss']
})

export class ResetpasswordComponent implements OnInit {
  public id;
  model = {
    password: '',
    password2: ''
  }

  constructor(private activatedRoute: ActivatedRoute, public userService: UserService, public router: Router) { }

  ngOnInit(): void {
    let params: any = this.activatedRoute.snapshot.params
    this.userService.sendtoken(params.token).subscribe(
      res => {
        this.id = res;
      },
    )
  }
  onSubmit(form: NgForm) {
    this.userService.resetpassword(form.value, this.id.id).subscribe(
      result => {
        alert(result[0].msg);
        this.router.navigateByUrl('/signin');

      }
    )

  }


}


