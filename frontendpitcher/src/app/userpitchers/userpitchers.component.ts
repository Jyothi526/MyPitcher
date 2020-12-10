import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { PitcherService } from '../shared/pitcherservice/pitcher.service';
import { UserService } from '../shared/userservice/user.service';
import { environment } from '../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
export interface DialogData {
  message: string;
}

@Component({
  selector: 'app-userpitchers',
  templateUrl: './userpitchers.component.html',
  styleUrls: ['./userpitchers.component.scss']
})
export class UserpitchersComponent implements OnInit {

  constructor(public pitchService: PitcherService, public userService: UserService, public router: Router,
    private snackBar: MatSnackBar, public dialog: MatDialog) { }

  apiURL = environment.apiBaseUrl + '/';
  udata: JSON;
  pitchers: any;
  sharableLink: any;
  isDeleted: any;
  async ngOnInit() {

    this.udata = this.userService.getCurrUser()
    if (!this.udata) {
      console.log("Hai");
      this.router.navigate(['/signin'])
    }

    else {
      this.pitchers = await this.pitchService.getallpitchers(this.udata['email']);
      console.log('Existing pitches by user:', this.pitchers);

    }
  }

  newPitch() {
    this.router.navigate(['/newpitch'])
  }

  editPitch(pid) {
    this.router.navigate(['edit/' + pid])
  }

  viewPitch(pid) {
    this.router.navigate(['view/' + pid])
  }
  sharePitch(pid) {
    this.router.navigate(['sharepitch/' + pid])
  }
  async deletePitch(pid) {
    const dialogRef = this.dialog.open(DelpitchDialog, {
      width: "500px",
      data: { pid: pid },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      //If user okays delete, perform the delete
      if (result) {
        var delresult = <JSON>(
          await this.pitchService.deletePitch(result.pid)
        );
        if (delresult["result"] == "ok") {
          this.openSnackBar("Pitch deletd successfully!", "Dismiss");
          this.ngOnInit();
        } else {
          this.openSnackBar(delresult["result"], "Dismiss");
        }
      }
    });
  }
  async generatePdf(pid) {

    const result = await this.pitchService.generatePdf(pid);
    this.openSnackBar(result['result'], 'Dismiss');
  }
  async shareLink(pid) {
    this.sharableLink = await this.pitchService.shareLink(pid);
    const url = this.sharableLink['result'];

    if (this.sharableLink['isFilled']) {
      window.open(url, "mywindow", "location=1,status=1,scrollbars=1, width=1000,height=800");
    }
    else {

      this.openSnackBar(this.sharableLink['result'], 'Dismiss');
    }
  }
  openSnackBar(message, action) {
    this.snackBar.open(message, action, { duration: 3000, panelClass: ['snackBar'] })
  }
  async sendPdfToMail(pid) {
    const result = await this.pitchService.sendPdfToMail(pid, this.udata['email']);
    this.openSnackBar(result['msg'], "dismiss");
  }
  async copyLink(pid) {
    this.sharableLink = await this.pitchService.shareLink(pid);
    if (this.sharableLink['isFilled']) {
      let selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value = this.sharableLink['result'];
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
      this.openSnackBar("link copied successfully", 'Dismiss');
    }
    else {
      this.openSnackBar(this.sharableLink['result'], 'Dismiss');
    }

  }
  async logout() {
    const logout = <JSON>await this.userService.logout();
    console.log("logout in userpitcher is", logout);
    if (logout['status']) {
      this.router.navigateByUrl('signin');
    }
  }

}
@Component({
  selector: "delpitch-dialog",
  templateUrl: "delpitch-dialog.html",
})
export class DelpitchDialog {
  emailusers = new FormControl();

  constructor(
    public dialogRef: MatDialogRef<DelpitchDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}