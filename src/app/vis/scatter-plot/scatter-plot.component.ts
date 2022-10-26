import { Car } from './../../model/car';
import { CarService } from './../../service/car.service';
import { Component, OnInit, Input, ElementRef } from '@angular/core';

declare const Plotly : any;

@Component({
  selector: 'app-scatter-plot',
  templateUrl: './scatter-plot.component.html',
  styleUrls: ['./scatter-plot.component.scss']
})
export class ScatterPlotComponent implements OnInit {

  @Input() xAttribute : string = '';
  @Input() yAttribute : string = '';
  @Input() categoricalAttribute : string = '';
  @Input() title : string = '';

  private data : Car[] = [];

  constructor(
    private carService:CarService,
    private elRef:ElementRef) { }

  ngOnInit(): void {
    this.carService.cars.subscribe(cars => {
      this.data = cars;
      this.drawPlot();
    });

    this.carService.mainBrushingSelection.subscribe(cars => {
      this.data = cars;
      this.drawPlot();
    });
  }

  drawPlot() {

    var data = [];

    if (this.categoricalAttribute == '') {
      var trace1 = {
        x: this.data.map(x => x[this.xAttribute as keyof Car]),
        y: this.data.map(x => x[this.yAttribute as keyof Car]),
        mode: 'markers',
        type: 'scatter',
        marker: { size: 12 }
      };
      data.push(trace1);
    } else {

      var uniqueVals = new Set(this.data.map(car => car[this.categoricalAttribute as keyof Car]));
      uniqueVals.forEach(value => {
        var dataValues = this.data.filter(car => {
          return car[this.categoricalAttribute as keyof Car] == value;
        });

        var trace = {
          x: dataValues.map(x => x[this.xAttribute as keyof Car]),
          y: dataValues.map(x => x[this.yAttribute as keyof Car]),
          mode: 'markers',
          type: 'scatter',
          name: value,
          marker: { size: 12 }
        };
        data.push(trace);
      })

    }

    console.log(data);

    var layout = {
      xaxis: {
        range: this.carService.getRange(this.xAttribute),
        title: this.xAttribute
      },
      yaxis: {
        range: this.carService.getRange(this.yAttribute),
        title: this.yAttribute
      },
      title: this.title
    };

    var config = {responsive: true}


    Plotly.newPlot('scatterplot', data, layout, config);

    (document.getElementById('scatterplot') as any).on('plotly_hover', this.onDataHovering.bind(this));
    (document.getElementById('scatterplot') as any).on('plotly_selected', this.onDataBrushing.bind(this));
  }

  onDataBrushing(event:any) {

    var selection: Car[] = [];

    if (event == undefined) {
      this.carService.resetBrushingSelection();
      return;
    }

    event.points.forEach((point: { x: string | number; y: string | number; }) => {
      this.data
        .filter(car => car[this.xAttribute as keyof Car] == point.x && car[this.yAttribute as keyof Car] == point.y)
        .forEach(car => {
          if (!selection.includes(car)) {
            selection.push(car);
          }
        });
    });

    this.carService.setBrushingSelection(selection);

  }

  onDataHovering(event:any) {
    this.carService.selectCar(
      this.data
        .filter(car => car[this.xAttribute as keyof Car] == event.points[0].x && car[this.yAttribute as keyof Car] == event.points[0].y)[0]
    );
  }



}
