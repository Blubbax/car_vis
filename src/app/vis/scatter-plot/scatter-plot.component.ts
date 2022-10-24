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

    this.elRef.nativeElement.querySelector('#scatterplot').addEventListener('plotly_selected', this.onDataSelected.bind(this));
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


    Plotly.newPlot('scatterplot', data, layout);

  }

  onDataSelected(event:any) {
    var x : any = [];
    var y : any = [];

    console.log("Here i am")

    console.log(event.points)
    event.points.forEach((pt: { x: any; y: any; }) => {
      x.push(pt.x);
      y.push(pt.y);
    });


    // Plotly.restyle(graphDiv, {
    //   x: [x, y],
    //   xbins: {}
    // }, [1, 2]);

    // Plotly.restyle(graphDiv, 'marker.color', [colors], [0]);
  }

}
