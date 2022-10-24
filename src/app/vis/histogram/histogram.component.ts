import { CarService } from './../../service/car.service';
import { Car } from './../../model/car';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

declare const Plotly : any;

@Component({
  selector: 'app-histogram',
  templateUrl: './histogram.component.html',
  styleUrls: ['./histogram.component.scss']
})
export class HistogramComponent implements OnInit {

  // https://www.intertech.com/using-plotly-js-to-add-interactive-data-visualizations-in-angular/
  // https://plotly.com/javascript/histograms/

  private data : Car[] = [];
  @Input() attribute : string = '';

  constructor(private carService:CarService) {

  }

  drawPlot() {
    var data = [
      {
        x: this.data.map(x => x[this.attribute as keyof Car]),
        type: 'histogram',
        marker: {
          color: 'blue',
        },
      }
    ];

    var layout = {
      title: this.attribute,
      xaxis: {title: "Value"},
//      yaxis: {title: "Count"}
    };

    Plotly.newPlot('histogram'+this.attribute, data, layout);
  }

  ngOnInit(): void {
    this.carService.cars.subscribe(cars => {
      this.data = cars;
      this.drawPlot();
    });
  }

}
