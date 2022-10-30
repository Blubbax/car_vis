import { Car } from './../../model/car';
import { CarService } from './../../service/car.service';
import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';

declare const Plotly: any;

// https://codepen.io/eni9889/pen/GRJGjmW

@Component({
  selector: 'app-rangeslider',
  templateUrl: './rangeslider.component.html',
  styleUrls: ['./rangeslider.component.scss']
})
export class RangesliderComponent implements OnInit {

  @Input() attribute: String = '';
  private data: Car[] = [];
  private categorical: Map<String, number> = new Map();

  @Output() selectionEvent = new EventEmitter<Car[]>();

  constructor(private carService: CarService) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.carService.cars.subscribe(cars => {
      this.data = cars;
      this.drawSlider();
    });
  }

  drawSlider() {

    var selectorOptions = {
      buttons: [{
        step: 'all',
      }]
    }

    var uniqueValues = this.carService.getUniqueVals(this.attribute);
    this.categorical = uniqueValues;

    var trace;
    var layout;

    if (uniqueValues.size > 0) {
      // categoric

      var categoricalData = this.data.map(element => {
        var key: String = new String(element[this.attribute as keyof Car]);
        return uniqueValues.get(key.toString());
      });

      trace = {
        type: "histogram",
        //mode: "lines",
        name: this.attribute,
        x: categoricalData,

        line: { color: '#17BECF' }
      }


      layout = {
        title: this.attribute,
        xaxis: {
          autorange: true,
          rangeselector: selectorOptions,
          rangeslider: {},
          tickvals: Array.from(uniqueValues.values()),
          ticktext: Array.from(uniqueValues.keys())
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
    } else {
      // numeric
      trace = {
        type: "histogram",
        //mode: "lines",
        name: this.attribute,
        x: this.data.map(car => car[this.attribute as keyof Car]),

        line: { color: '#17BECF' }
      }

      layout = {
        title: this.attribute,
        xaxis: {
          autorange: true,
          rangeselector: selectorOptions,
          rangeslider: {},
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
    }

    var plotData = [trace];

    Plotly.newPlot('rangeslider' + this.attribute, plotData, layout);

    // Thanks to https://stackoverflow.com/questions/40352171/plotly-rangeslider-how-to-determine-if-range-is-selected
    (document.getElementById('rangeslider' + this.attribute) as any).on('plotly_relayout', this.onDataBrushing.bind(this));
    (document.getElementById('rangeslider' + this.attribute) as any).on('plotly_doubleclick', this.onSelectionReset.bind(this));

  }

  onSelectionReset(event: any) {
    var selection = this.data;
    this.selectionEvent.emit(selection);
  }

  onDataBrushing(event: any) {

    if (event["xaxis.autorange"] === true) {
      return;
    }

    var selection: Car[] = [];

    if (event == undefined) {
      selection = this.data;
      this.selectionEvent.emit(selection);
      return;
    }

    var xAxisLeft: number;
    var xAxisRight: number;

    if (event["xaxis.range"] === undefined) {
      xAxisLeft = event["xaxis.range[0]"];
      xAxisRight = event["xaxis.range[1]"];
    } else {
      xAxisLeft = event["xaxis.range"][0];
      xAxisRight = event["xaxis.range"][1];
    }

    if (this.categorical.size > 0) {
      // categorical
      var uniqueValues = this.categorical;
      this.data.forEach(car => {
        var value = uniqueValues.get(new String(car[this.attribute as keyof Car]).toString());
        if (value !== undefined && value >= xAxisLeft && value <= xAxisRight) {
          selection.push(car);
        }

      });

    } else {
      // numerical
      this.data.forEach(car => {
        if (car[this.attribute as keyof Car] >= xAxisLeft
          && car[this.attribute as keyof Car] <= xAxisRight) {
          selection.push(car);
        }
      });
    }

    this.selectionEvent.emit(selection);
  }


}
