import { Injectable, Type } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Pitcher } from './pitcher.model';
import { Form } from '@angular/forms';
import { CookieService } from "ngx-cookie-service";
import { UserService } from '../userservice/user.service';
@Injectable({
  providedIn: 'root'
})
export class PitcherService {


  constructor(public http: HttpClient,
    public router: Router, private cookieService: CookieService,
    private userService: UserService) { }

  getTemplate() {
    return new Promise((resolve) => {
      this.http.post(environment.apiBaseUrl + '/pitch/gettemplate', {}).subscribe((data) => {
        resolve(data);
      });
    });
  }


  getallpitchers(email) {

    return new Promise((resolve) => {
      this.http.post(environment.apiBaseUrl + '/pitch/getbyemail', { "email": email, "userdata": JSON.stringify(this.userService.getCurrUser()) }).subscribe((data) => {
        resolve(data);
      });
    });
  }

  addPitch(formData: FormData) {
    console.log("form Data is:", formData)
    return new Promise((resolve) => {
      this.http.post(environment.apiBaseUrl + "/pitch/addPitch", formData).subscribe((data) => {
        resolve(data);
      });
    });
  }

  getPitchWithId(id: String) {
    return new Promise((resolve) => {
      this.http.post(environment.apiBaseUrl + '/pitch/getwithid', { "pid": id, "userdata": JSON.stringify(this.userService.getCurrUser()) }).subscribe((data) => {
        resolve(data);
      });
    });
  }
  getPitchWithIdforview(id: String) {
    return new Promise((resolve) => {
      this.http.post(environment.apiBaseUrl + '/pitch/getwithidforview', { "pid": id, "userdata": JSON.stringify(this.userService.getCurrUser()) }).subscribe((data) => {
        resolve(data);
      });
    });
  }

  deletePitchLogo(pid) {
    return new Promise((resolve) => {
      this.http.post(environment.apiBaseUrl + '/pitch/deleteLogo', { "pid": pid, "userdata": JSON.stringify(this.userService.getCurrUser()) }).subscribe((data) => {
        resolve(data);
      });
    });
  }
  deletePitchImage(pid, teamDetails) {
    return new Promise((resolve) => {
      this.http.post(environment.apiBaseUrl + '/pitch/deleteImage', { "pid": pid, "teamDetails": teamDetails, "userdata": JSON.stringify(this.userService.getCurrUser()) }).subscribe((data) => {
        resolve(data);
      });
    });
  }

  updatePitch(formData: FormData) {
    return new Promise((resolve) => {
      this.http.post(environment.apiBaseUrl + "/pitch/updatePitch", formData).subscribe((data) => {
        resolve(data);
      });
    });
  }

  generatePdf(pid) {
    return new Promise((resolve) => {
      this.http.post(environment.apiBaseUrl + '/pitch/pdfGenerator', { "pid": pid, "userdata": JSON.stringify(this.userService.getCurrUser()) }).subscribe((data) => {
        resolve(data);
      })

    })
  }
  shareLink(pid) {
    pid = {
      pid: pid
    }
    return new Promise((resolve) => {
      this.http.post(environment.apiBaseUrl + '/pitch/getlink', pid).subscribe((data) => {

        resolve(data);

      })
    })
  }
  deletePitch(pid) {
    return new Promise((resolve) => {
      this.http.delete(environment.apiBaseUrl + `/pitch/deletepitch/${pid}`).subscribe((data) => {
        resolve(data);
      })
    })
  }
  isValid(pobj) {
    return new Promise((resolve) => {
      var sum = 0, data, k = 0;
      console.log(pobj);
      for (let i of pobj['inputs']) {
        if (i['header'] == "Ownership") {
          if (i['tableData'] != ['']) {
            for (let j of i['tableData']) {
              if (k > 0) {
                sum = sum + j[1];
              }
              k = k + 1;
            }
          }
          if (sum > 100 || sum < 100)
            data = { "status": false, "msg": "sum of %Ownership must be equal to 100" };
        }
        else {
          data = { "status": true };
        }
      }
      resolve(data);
    })
  }
  sendPdfToMail(pid, email) {

    return new Promise((resolve) => {
      this.http.post(environment.apiBaseUrl + "/pitch/sendPdf", { "pid": pid, "email": email, "userdata": JSON.stringify(this.userService.getCurrUser()) }).subscribe((data) => {
        resolve(data);
      })
    })
  }
}

