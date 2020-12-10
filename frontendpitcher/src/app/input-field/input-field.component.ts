import { Component, EventEmitter, Input, OnInit, Output, NgZone, ViewChild } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take } from 'rxjs/operators';
@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.scss']
})
export class InputFieldComponent implements OnInit {
  @Output() onChange = new EventEmitter();
  @Input() inputObj: any;
  @Input() index: number;
  //for validation
  flag: boolean
  //mat-table options
  tableDisplayedColumns = []
  change(newValue) {
    console.log('newvalue', newValue)
    this.flag = false;
    //use below for validation
    if (this.inputObj['InputType'] == 'text' || this.inputObj['InputType'] == 'big-text' || this.inputObj['InputType'] == 'number' || this.inputObj['InputType'] == 'select-single') {

    }
    else if (this.inputObj['InputType'] == 'select-multiple') {
      this.inputObj['content'] = newValue
    }
    this.onChange.emit(this.inputObj);
  }
  constructor(private _ngZone: NgZone) { }
  ngOnInit(): void {

    console.log("Table is:", this.inputObj['tableData'])
    switch (this.inputObj['header']) {
      case '3 Year Forecast': {
        this.tableDisplayedColumns = this.inputObj['tableData'][0]
        break;
      }
      case 'Accomplishments': {
        this.tableDisplayedColumns = ['1', '2', '3', '4', '5', '6', '7', '8']


        break;
      }
      case 'Ownership': {
        this.tableDisplayedColumns = this.inputObj['tableData'][0]
        break;
      }
    }
  }
  //To resize the text area when number of lines increases
  @ViewChild('autosize') autosize: CdkTextareaAutosize;
  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }
}