import {
  Component,
  OnInit,
  Input
} from "@angular/core";

// import { BaseChartModel } from "@models";
import { environment } from 'src/environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { NgxChartsModule } from '@swimlane/ngx-charts';
@Component({
  selector: 'app-view-chart',
  templateUrl: './view-chart.component.html',
  styleUrls: ['./view-chart.component.scss']
})

export class ViewChartComponent implements OnInit {

  @Input() inputObj: any;
  apiURL = environment.apiBaseUrl;
  graphData: any[]
  tableType: String
  view: any[]
  constructor() {
    this.view = [innerWidth / 2.45, 400];
  }

  // graph options
  showXAxis = true;
  showYAxis = true;
  gradient = true;
  showLegend = true;
  legendPosition = true;
  showXAxisLabel = true;
  xAxisLabel = '';
  showYAxisLabel = true;
  yAxisLabel = '';
  //  legendTitle = 'Ownership';
  //  showLabels = true;
  isDoughnut = true;
  colorScheme = {
    domain: ['#45dfe8', '#1a163d', '#240eec', '#05a3ac', '#5847ee']
  };

  ngOnInit() {
    this.graphs();
  }
  onResize(event) {
    this.view = [event.target.innerWidth / 2.4, 400];
  }
  graphs() {
    switch (this.inputObj['header']) {
      case "3 Year Forecast": {

        this.yAxisLabel = this.inputObj['tableData'][1][0] + " & " + this.inputObj['tableData'][2][0]

        this.graphData = [
          {
            "name": this.inputObj['tableData'][0][1],
            "series": [
              {
                "name": this.inputObj['tableData'][1][0],
                "value": this.inputObj['tableData'][1][1]
              },
              {
                "name": this.inputObj['tableData'][2][0],
                "value": this.inputObj['tableData'][2][1]
              }
            ]
          },
          {
            "name": this.inputObj['tableData'][0][2],
            "series": [
              {
                "name": this.inputObj['tableData'][1][0],
                "value": this.inputObj['tableData'][1][2]
              },
              {
                "name": this.inputObj['tableData'][2][0],
                "value": this.inputObj['tableData'][2][2]
              }
            ]
          },
          {
            "name": this.inputObj['tableData'][0][3],
            "series": [
              {
                "name": this.inputObj['tableData'][1][0],
                "value": this.inputObj['tableData'][1][3]
              },
              {
                "name": this.inputObj['tableData'][2][0],
                "value": this.inputObj['tableData'][2][3]
              }
            ]
          },
          {
            "name": this.inputObj['tableData'][0][4],
            "series": [
              {
                "name": this.inputObj['tableData'][1][0],
                "value": this.inputObj['tableData'][1][4]
              },
              {
                "name": this.inputObj['tableData'][2][0],
                "value": this.inputObj['tableData'][2][4]
              }
            ]
          },
          {
            "name": this.inputObj['tableData'][0][5],
            "series": [
              {
                "name": this.inputObj['tableData'][1][0],
                "value": this.inputObj['tableData'][1][5]
              },
              {
                "name": this.inputObj['tableData'][2][0],
                "value": this.inputObj['tableData'][2][5]
              }
            ]
          },
        ]
        console.log('3 year forecast graph data:', this.graphData)
        break;
      }


      case "Ownership": {
        this.graphData = []
        for (var i = 1; i < this.inputObj['tableData'].length; i++) {
          if (this.inputObj['tableData'][i][0] != "" && this.inputObj['tableData'][i][1] != "") {
            this.graphData.push({ "name": this.inputObj['tableData'][i][0], "value": this.inputObj['tableData'][i][1] })
          }
        }
        console.log('Pie chart data:', this.graphData)
        break;
      }
    }
  }
}
