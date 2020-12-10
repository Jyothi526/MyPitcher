import { Component, Input, OnInit, NgModule } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-view-field',
  templateUrl: './view-field.component.html',
  styleUrls: ['./view-field.component.scss']
})
export class ViewFieldComponent implements OnInit {

  @Input() inputObj: any;
  apiURL = environment.apiBaseUrl;
  tableDisplayedColumns: string[];
  header2: any;
  header1: any;
  constructor() { }

  @Input() graphData: any[]

  ngOnInit(): void {



    switch (this.inputObj['header']) {
      case '3 Year Forecast': {
        this.tableDisplayedColumns = this.inputObj['tableData'][0]
        break;
      }
      case 'Accomplishments': {
        this.header1 = this.inputObj['tableData'][0][0];
        this.header2 = this.inputObj['tableData'][1][0];

        break;
      }
      case 'Ownership': {
        this.tableDisplayedColumns = this.inputObj['tableData'][0]
        break;
      }
    }

  }
}
