import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

declare const Plotly : any;

@Component({
  selector: 'app-histogram',
  templateUrl: './histogram.component.html',
  styleUrls: ['./histogram.component.scss']
})
export class HistogramComponent implements OnInit {

  // https://www.intertech.com/using-plotly-js-to-add-interactive-data-visualizations-in-angular/
  // https://plotly.com/javascript/histograms/



  constructor() { }

  ngOnInit(): void {

    var data = [
      {
        x: [1,2,2,2,2,3,3,4,5,10],
        type: 'histogram',
        marker: {
          color: 'blue',
        },
      }
    ];

    var layout = {
      title: "Sampled Results",
      xaxis: {title: "Value"},
      yaxis: {title: "Count"}
    };

    Plotly.newPlot('histogram', data, layout);
  }

}
