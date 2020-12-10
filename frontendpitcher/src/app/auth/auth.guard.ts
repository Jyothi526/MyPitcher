import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from "../shared/userservice/user.service";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  udata: any;
  constructor(public userService: UserService, public router: Router, private cookieService: CookieService) { }

  //checking whether user is loggedin and deleting the token 
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    if (this.cookieService.get("udata")) {
      this.udata = JSON.parse(this.cookieService.get("udata"))
      this.userService.setUser(this.udata);
      return true;
    }
    else {
      this.router.navigateByUrl('/signin');
      this.cookieService.deleteAll();
      return false;
    }

  }

}
