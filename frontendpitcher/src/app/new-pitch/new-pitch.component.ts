import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { UserService } from '../shared/userservice/user.service';
import { PitcherService } from '../shared/pitcherservice/pitcher.service';
import { Router } from '@angular/router';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
@Component({
  selector: 'app-new-pitch',
  templateUrl: './new-pitch.component.html',
  styleUrls: ['./new-pitch.component.scss']
})
export class NewPitchComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagsControl = new FormControl();
  filteredTags: Observable<string[]>;
  tags: string[] = [];
  allTags: string[];
  teamDetails: any;
  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  pobj: any
  udata: any
  docName: string
  logoFiles;
  Teamfile1;
  Teamfile2;
  Teamfile3;
  Teamfile4;
  Teamfile5;
  constructor(public userService: UserService, public router: Router, public pitcherService: PitcherService, public _snackBar: MatSnackBar) { }

  async ngOnInit() {
    console.log('Inside new pitch')
    //check if user is authed
    this.udata = this.userService.getCurrUser()
    console.log('New pitch has user:', this.udata)
    if (!this.udata) {
      //this.router.navigate(['/signin'])
    }
    this.pobj = <JSON>await this.pitcherService.getTemplate()
    this.allTags = this.pobj['tagsOptions'];
    this.teamDetails = this.pobj['teamDetails'];
    console.log("teamdetails1 is:", this.teamDetails);
    this.filteredTags = this.tagsControl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) => tag ? this._filter(tag) : this.allTags.slice()));
    console.log("Pitch Template:", this.pobj)
  }

  testBtn() {
    console.log('Pitch object:', this.pobj)
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
    formData.append("email", this.udata['email'])
    formData.append("documentName", this.docName)
    if (this.allTags) {
      for (let i of this.allTags) {
        formData.append("tagOptions", i);
      }
    }
    //formData.append
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
    const isValid = await this.pitcherService.isValid(this.pobj)
    if (isValid['status']) {
      const result = await this.pitcherService.addPitch(formData)
      if (result['result'] == 'ok') {
        this.showSnack("Form Added", 'Dismiss');
        this.router.navigate(['/userpitchers'])
      }
    }
    else {
      this.showSnack(isValid['msg'], "Dismiss");
    }
  }

  goHome() {
    this.router.navigate(['/userpitchers'])
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
  showSnack(msg: string, action) {
    this._snackBar.open(msg, action, { duration: 3000, panelClass: ['snackBar'] });
  }

}