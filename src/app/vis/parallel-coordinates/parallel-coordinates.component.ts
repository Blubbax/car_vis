import { Car } from './../../model/car';
import { CarService } from './../../service/car.service';
import { Component, OnInit, Input } from '@angular/core';

declare const Plotly : any;

@Component({
  selector: 'app-parallel-coordinates',
  templateUrl: './parallel-coordinates.component.html',
  styleUrls: ['./parallel-coordinates.component.scss']
})
export class ParallelCoordinatesComponent implements OnInit {


  @Input() attributes : string[] = [];
  private data : Car[] = [];

  constructor(private carService:CarService) { }

  ngOnInit(): void {
    this.carService.cars.subscribe(cars => {
      this.data = cars;
      this.drawPlot();
    })

  }

  drawPlot() {
    var dimensions: { range: (string | number)[]; label: string; values: (string | number)[]; }[]= [];
    this.attributes.forEach(attribute => {
      var data = this.data.map(x => x[attribute as keyof Car]);
      dimensions.push({
        range: this.carService.getRange(attribute),
        label: attribute,
        values: data
      });
    })


    var trace = {
      type: 'parcoords',
      line: {
        color: 'blue'
      },

      dimensions: dimensions
    };

    var data = [trace]

    Plotly.newPlot('parallel-coordinates', data);

  }

}
