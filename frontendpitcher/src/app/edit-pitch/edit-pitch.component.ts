import { Component, Inject, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../shared/userservice/user.service';
import { PitcherService } from '../shared/pitcherservice/pitcher.service';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { environment } from 'src/environments/environment';


export interface DialogData {
  message: string;
}

@Component({
  selector: 'app-edit-pitch',
  templateUrl: './edit-pitch.component.html',
  styleUrls: ['./edit-pitch.component.scss']
})
export class EditPitchComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagsControl = new FormControl();
  filteredTags: Observable<string[]>;
  tags: string[] = [];
  allTags: string[];
  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  pitchId: String
  pobj: any
  udata: any
  logo; img1; img2; img3; img4; img5;
  logoFiles;
  Teamfile1;
  Teamfile2;
  Teamfile3;
  Teamfile4;
  Teamfile5;

  constructor(
    private route: ActivatedRoute, public userService: UserService, public router: Router, public pitcherService: PitcherService, public dialog: MatDialog, private _snackBar: MatSnackBar,
  ) {
    this.route.params.subscribe((params) => {
      console.log("Editor for pitch with id:", params);
      this.pitchId = params["id"];
    });
  }

  async ngOnInit() {
    console.log('Inside edit pitch component')
    //check if user is authed
    this.udata = this.userService.getCurrUser()
    console.log('New pitch has user:', this.udata)
    if (!this.udata) {
      this.router.navigate(['/signin'])
    }
    this.pobj = <JSON>await this.pitcherService.getPitchWithId(this.pitchId)
    this.tags = this.pobj['tags'];
    this.allTags = this.pobj['tagOptions'];
    this.filteredTags = this.tagsControl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) => tag ? this._filter(tag) : this.allTags.slice()));
    console.log("Pitch Object for Edit:", this.pobj)
    this.logo = environment.apiBaseUrl + `/${this.pobj['company_logo'][0]}`;
    this.img1 = environment.apiBaseUrl + `/${this.pobj['teamDetails1']['imgpath']}`;
    this.img2 = environment.apiBaseUrl + `/${this.pobj['teamDetails2']['imgpath']}`;
    this.img3 = environment.apiBaseUrl + `/${this.pobj['teamDetails3']['imgpath']}`;
    this.img4 = environment.apiBaseUrl + `/${this.pobj['teamDetails4']['imgpath']}`;
    this.img5 = environment.apiBaseUrl + `/${this.pobj['teamDetails5']['imgpath']}`;

  }

  selectLogoFiles(event) {
    if (event.target.files.length > 0) {
      this.logoFiles = event.target.files;
    }
  }
  selectTeamImage1(event) {
    if (event.target.files.length > 0) {
      this.Teamfile1 = event.target.files;
    }
  }
  selectTeamImage2(event) {
    if (event.target.files.length > 0) {
      this.Teamfile2 = event.target.files;
    }
  }
  selectTeamImage3(event) {
    if (event.target.files.length > 0) {
      this.Teamfile3 = event.target.files;
    }
  }
  selectTeamImage4(event) {
    if (event.target.files.length > 0) {
      this.Teamfile4 = event.target.files;
    }
  }
  selectTeamImage5(event) {
    if (event.target.files.length > 0) {
      this.Teamfile5 = event.target.files;
    }
  }


  goHome() {
    this.router.navigate(['/userpitchers'])
  }

  testBtn() {
    console.log('Pitch object:', this.pobj)
  }

  async doSave() {
    const formData = new FormData();
    formData.append("pid", this.pobj['_id'])
    formData.append("docName", this.pobj['documentName'])
    if (this.tags) {
      for (let i of this.tags) {
        formData.append("tags", i);
      }
    }
    if (this.logoFiles) {
      for (let file of this.logoFiles) {
        formData.append("logo", file)
      }
    }
    if (this.Teamfile1) {
      for (let file of this.Teamfile1) {
        formData.append("Teamfile1", file)
      }
    }
    if (this.Teamfile2) {
      for (let file of this.Teamfile2) {
        formData.append("Teamfile2", file)
      }
    }
    if (this.Teamfile3) {
      for (let file of this.Teamfile3) {
        formData.append("Teamfile3", file)
      }
    }
    if (this.Teamfile4) {
      for (let file of this.Teamfile4) {
        formData.append("Teamfile4", file)
      }
    }
    if (this.Teamfile5) {
      for (let file of this.Teamfile5) {
        formData.append("Teamfile5", file)
      }
    }
    for (let i in this.pobj['inputs']) {
      formData.append("inputs[]", JSON.stringify(this.pobj['inputs'][i]))
    }
    formData.append("teamDetails1", JSON.stringify(this.pobj['teamDetails1']));
    formData.append("teamDetails2", JSON.stringify(this.pobj['teamDetails2']));
    formData.append("teamDetails3", JSON.stringify(this.pobj['teamDetails3']));
    formData.append("teamDetails4", JSON.stringify(this.pobj['teamDetails4']));
    formData.append("teamDetails5", JSON.stringify(this.pobj['teamDetails5']));


    const result = await this.pitcherService.updatePitch(formData)
    if (result['result'] == 'ok') {
      this.showSnack("Form Progress Saved", "Dismiss");
    }
  }
  async logout() {
    const logout = <JSON>await this.userService.logout();
    console.log("logout in userpitcher is", logout);
    if (logout['status']) {
      this.router.navigateByUrl('signin');
    }
  }

  async saveBtn() {
    const formData = new FormData();
    formData.append("pid", this.pobj['_id'])
    formData.append("docName", this.pobj['documentName'])
    if (this.tags) {
      for (let i of this.tags) {
        formData.append("tags", i);
      }
    }
    if (this.logoFiles) {
      for (let file of this.logoFiles) {
        formData.append("logo", file)
      }
    }
    if (this.Teamfile1) {
      for (let file of this.Teamfile1) {
        formData.append("Teamfile1", file)
      }
    }
    if (this.Teamfile2) {
      for (let file of this.Teamfile2) {
        formData.append("Teamfile2", file)
      }
    }
    if (this.Teamfile3) {
      for (let file of this.Teamfile3) {
        formData.append("Teamfile3", file)
      }
    }
    if (this.Teamfile4) {
      for (let file of this.Teamfile4) {
        formData.append("Teamfile4", file)
      }
    }
    if (this.Teamfile5) {
      for (let file of this.Teamfile5) {
        formData.append("Teamfile5", file)
      }
    }
    for (let i in this.pobj['inputs']) {
      formData.append("inputs[]", JSON.stringify(this.pobj['inputs'][i]))
    }
    formData.append("teamDetails1", JSON.stringify(this.pobj['teamDetails1']));
    formData.append("teamDetails2", JSON.stringify(this.pobj['teamDetails2']));
    formData.append("teamDetails3", JSON.stringify(this.pobj['teamDetails3']));
    formData.append("teamDetails4", JSON.stringify(this.pobj['teamDetails4']));
    formData.append("teamDetails5", JSON.stringify(this.pobj['teamDetails5']));
    formData.append("userdata", JSON.stringify(this.userService.getCurrUser()));


    const result = await this.pitcherService.updatePitch(formData)
    if (result['result'] == 'ok') {
      this.showSnack("Form Updated", "Dismiss");
      this.router.navigate(['/userpitchers'])
    }
  }

  deleteLogo(img) {
    console.log("request delete of image at:", img);

    const dialogRef = this.dialog.open(DelconfirmDialog, {
      width: "500px",
      data: { img: img },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      console.log("The dialog was closed with result", result);
      //If user okays delete, perform the delete
      if (result) {
        var delresult = <JSON>(
          await this.pitcherService.deletePitchLogo(this.pobj['_id'])
        );
        if (delresult["result"] == "ok") {
          this.showSnack("Logo Deleted successfully!", "Dismiss");
          this.pobj = <JSON>await this.pitcherService.getPitchWithId(this.pitchId)
        } else {
          this.showSnack(delresult["result"], "Dismiss");
        }
      }
    });
  }

  deleteImg(teamDetails) {
    console.log("request delete of image at:", this.pobj[teamDetails]['imgpath']);

    const dialogRef = this.dialog.open(DelconfirmDialog, {
      width: "500px",
      data: { teamDetails: teamDetails },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      console.log("The dialog was closed with result", result);
      //If user okays delete, perform the delete
      if (result) {
        var delresult = <JSON>(
          await this.pitcherService.deletePitchImage(this.pobj['_id'], teamDetails)
        );
        if (delresult["result"] == "ok") {
          this.showSnack("Image Deleted successfully!", "Dismiss");
          this.pobj = <JSON>await this.pitcherService.getPitchWithId(this.pitchId)
        } else {
          this.showSnack(delresult["result"], "Dismiss");
        }
      }
    });
  }

  isImgExist(teamDetails) {
    if (this.pobj[teamDetails]['imgpath']) {
      return true;
    }
    else {
      return false;
    }
  }
  showSnack(msg: string, action) {
    this._snackBar.open(msg, action, { duration: 3000, panelClass: ['snackBar'] });
  }
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.tags.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.tagsControl.setValue(null);
  }
  remove(fruit: string): void {
    const index = this.tags.indexOf(fruit);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }
  selected(event: MatAutocompleteSelectedEvent): void {
    this.tags.push(event.option.viewValue);
    this.tagInput.nativeElement.value = '';
    this.tagsControl.setValue(null);
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allTags.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  }


}


@Component({
  selector: "delconfirm-dialog",
  templateUrl: "delconfirm-dialog.html",
})
export class DelconfirmDialog {
  emailusers = new FormControl();

  constructor(
    public dialogRef: MatDialogRef<DelconfirmDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
