import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../shared/userservice/user.service';
import { PitcherService } from '../shared/pitcherservice/pitcher.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { FormControl } from '@angular/forms';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';
export interface DialogData {
  link: string
}

@Component({
  selector: 'app-view-pitch',
  templateUrl: './view-pitch.component.html',
  styleUrls: ['./view-pitch.component.scss']
})
export class ViewPitchComponent implements OnInit {

  pitchId: String
  pobj: any
  udata: any
  headerElements: [any]

  cards: any[]
  companyBasics: any[]
  companyInfoCards: any[]
  financialCards: any[]
  generalCards: any[]
  sharePitchLink;
  logo: string;
  img1: string;
  img2: string;
  img3: string;
  img4: string;
  img5: string;

  constructor(private route: ActivatedRoute, public dialog: MatDialog, public userService: UserService, public router: Router, public pitcherService: PitcherService) {
    this.route.params.subscribe((params) => {
      console.log("Editor for pitch with id:", params);
      this.pitchId = params["id"];
      this.sharePitchLink = `http://localhost:4200/sharepitch/${this.pitchId}`
    });
  }

  async ngOnInit() {
    this.udata = this.userService.getCurrUser()
    console.log('View pitch has user:', this.udata)
    this.pobj = <JSON>await this.pitcherService.getPitchWithIdforview(this.pitchId);
    if (!this.pobj) {
      alert("This pitch doesn't belong to you");
      this.router.navigateByUrl('/signin');
    }
    this.logo = environment.apiBaseUrl + `/${this.pobj['company_logo'][0]}`;
    this.img1 = environment.apiBaseUrl + `/${this.pobj['teamDetails1']['imgpath']}`;
    this.img2 = environment.apiBaseUrl + `/${this.pobj['teamDetails2']['imgpath']}`;
    this.img3 = environment.apiBaseUrl + `/${this.pobj['teamDetails3']['imgpath']}`;
    this.img4 = environment.apiBaseUrl + `/${this.pobj['teamDetails4']['imgpath']}`;
    this.img5 = environment.apiBaseUrl + `/${this.pobj['teamDetails5']['imgpath']}`;
    this.headerElements = [{}];
    for (var i = 0; i < this.pobj['inputs'].length; i++) {
      if (this.pobj['inputs'][i]['header'] == "Company name") {
        this.headerElements.push(this.pobj['inputs'][i]);
        this.pobj['inputs'].splice(i, 1);
      }
      if (this.pobj['inputs'][i]['header'] == "Company tagline") {
        this.headerElements.push(this.pobj['inputs'][i]);
        this.pobj['inputs'].splice(i, 1);
      }
      if (this.pobj['inputs'][i]['header'] == "Location") {
        this.headerElements.push(this.pobj['inputs'][i]);
        this.pobj['inputs'].splice(i, 1);
      }
      if (this.pobj['inputs'][i]['header'] == "Established in") {
        this.headerElements.push(this.pobj['inputs'][i]);
        this.pobj['inputs'].splice(i, 1);
      }
      if (this.pobj['inputs'][i]['header'] == "Fund raised") {
        this.headerElements.push(this.pobj['inputs'][i]);
        this.pobj['inputs'].splice(i, 1);
      }
      if (this.pobj['inputs'][i]['header'] == "Funding need") {
        this.headerElements.push(this.pobj['inputs'][i]);
        this.pobj['inputs'].splice(i, 1);
      }
      if (this.pobj['inputs'][i]['header'] == "Runway") {
        this.headerElements.push(this.pobj['inputs'][i]);
        this.pobj['inputs'].splice(i, 1);
      }

    }
    console.log("Header elements", this.headerElements);
    console.log("Pitch Object for view:", this.pobj)

    this.companyBasics = [
      {
        "cardName": "Company Basics",
        "fields": [1, 3, 4, 6]
      }
    ]
    this.companyInfoCards = [
      {
        "cardName": "Problem",
        "fields": [7]
      },
      {
        "cardName": "Solution",
        "fields": [8, 14]
      },
      {
        "cardName": "Industry & Competitive Landscape",
        "fields": [9, 12, 13, 15, 16]
      },
      {
        "cardName": "Product",
        "fields": [8, 10, 11]
      },


    ]

    this.financialCards = [
      {
        "cardName": "Market",
        "fields": [18, 19, 20, 21]
      },
      {
        "cardName": "Forecast",
        "fields": [22, 23]
      },
    ]

    this.generalCards = [
      {
        "cardName": "Team",
        "fields": [24, 25]
      },
      {
        "cardName": "Other",
        "fields": [1, 2, 5, 17, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35]
      }
    ]

  }

  async logout() {
    const logout = <JSON>await this.userService.logout();
    console.log("logout in userpitcher is", logout);
    if (logout['status']) {
      this.router.navigateByUrl('signin');
    }
  }

  goHome() {
    this.router.navigate(['/userpitchers'])
  }

  sharePitch() {
    const dialogRef = this.dialog.open(DialogElementsExampleDialog, {
      width: "500px",
      data: { link: this.sharePitchLink }
    });
  }
}
@Component({
  selector: 'dialog-elements-example-dialog',
  templateUrl: 'dialog-elements-example-dialog.html',
  //template:'passed in {{ data.link }}'
})
export class DialogElementsExampleDialog {
  emailusers = new FormControl();
  constructor(
    public dialogRef: MatDialogRef<DialogElementsExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private snackBar: MatSnackBar,
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, { duration: 3000, panelClass: ['snackBar'] })
    this.dialogRef.close();
  }
  copyInputMessage() {
    this.openSnackBar("Your Link is Copied", "Dismiss");
    // inputElement.select();
    // document.execCommand('copy');
    // inputElement.setSelectionRange(0, 0);
  }
}

