import { Car } from './../../model/car';
import { CarService } from './../../service/car.service';
import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';

declare const Plotly : any;

// https://codepen.io/eni9889/pen/GRJGjmW

@Component({
  selector: 'app-rangeslider',
  templateUrl: './rangeslider.component.html',
  styleUrls: ['./rangeslider.component.scss']
})
export class RangesliderComponent implements OnInit {

  @Input() attribute: String = '';
  private data : Car[] = [];

  @Output() selectionEvent = new EventEmitter<Car[]>();

  constructor(private carService: CarService) {
    this.carService.cars.subscribe(cars => {
      this.data = cars;
      this.drawSlider();
    })
  }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges) { }

  drawSlider() {

    var selectorOptions = {
      buttons: [{
        step: 'month',
        stepmode: 'backward',
        count: 1,
        label: '1m'
    }, {
        step: 'month',
        stepmode: 'backward',
        count: 6,
        label: '6m'
    }, {
        step: 'year',
        stepmode: 'todate',
        count: 1,
        label: 'YTD'
    }, {
        step: 'year',
        stepmode: 'backward',
        count: 1,
        label: '1y'
    }, {
        step: 'all',
    }]
    }


    var trace1 = {
      type: "histogram",
      //mode: "lines",
      name: this.attribute,
      x: this.data.map(car => car[this.attribute as keyof Car]),
      y: this.data.map(car => car.horsepower),
      line: {color: '#17BECF'}
    }

    var plotData = [trace1];

    var layout = {
        title: this.attribute,
        xaxis: {
          autorange: true,
          rangeselector: selectorOptions,
          rangeslider: {}
        },
        yaxis: {
          autorange: true
        },
        margin: {
          l: 30,
          r: 10,
          b: 10,
          t: 30,
          pad: 4
        },
        height: 200
    };

    Plotly.newPlot('rangeslider'+this.attribute, plotData, layout);

    // Thanks to https://stackoverflow.com/questions/40352171/plotly-rangeslider-how-to-determine-if-range-is-selected
    (document.getElementById('rangeslider'+this.attribute) as any).on('plotly_relayout', this.onDataBrushing.bind(this));
    (document.getElementById('rangeslider'+this.attribute) as any).on('plotly_doubleclick', this.onSelectionReset.bind(this));

  }

  onSelectionReset(event: any) {
    var selection = this.data;
    this.selectionEvent.emit(selection);
  }

  onDataBrushing(event:any) {

    var selection: Car[] = [];

    if (event == undefined) {
      selection = this.data;
      this.selectionEvent.emit(selection);
      return;
    }

    var xAxisLeft = event["xaxis.range"][0];
    var xAxisRight = event["xaxis.range"][1];
    if (xAxisLeft == undefined) {
      var xAxisLeft = event["xaxis.range[0]"];
      var xAxisRight = event["xaxis.range[1]"];
    }


    this.data.forEach(car => {
      if (car[this.attribute as keyof Car] >= xAxisLeft
          && car[this.attribute as keyof Car] <= xAxisRight) {
            selection.push(car);
      }
    });

    this.selectionEvent.emit(selection);
  }


}
