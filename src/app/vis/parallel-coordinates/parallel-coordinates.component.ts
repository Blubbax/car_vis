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
  private selectionRanges = new Map();

  constructor(private carService:CarService) { }

  ngOnInit(): void {

    this.carService.cars.subscribe(cars => {
      this.data = cars;
      this.drawPlot();
    });

    this.carService.brushingSelection.subscribe(cars => {
      this.data = cars;
      this.drawPlot();
      var timer = window.setTimeout(function(){ }, 700);
    })

  }

  drawPlot() {
    var dimensions: { label: string; values: (string | number)[]; }[]= [];
    this.attributes.forEach(attribute => {
      var data = this.data.map(x => x[attribute as keyof Car]);
      dimensions.push({

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

    var layout = { };

    var config = {responsive: true}

    Plotly.newPlot('parallel-coordinates', data, layout, config);

    // https://stackoverflow.com/questions/44723417/plotly-js-selection-event-for-parallel-coordinates-plot
    (document.getElementById('parallel-coordinates') as any).on('plotly_restyle', this.onDataBrushing.bind(this));
    (document.getElementById('parallel-coordinates') as any).on('plotly_doubleclick', this.onDataBrushing.bind(this));

  }



  onDataBrushing(event:any) {

    var attribute = '';
    var eventData;

    this.attributes.forEach((attr, index) => {
      if (event[0]['dimensions[' + index + '].constraintrange'] === null) {
        this.selectionRanges.delete(attr);
      } else {
        if (event[0]['dimensions[' + index + '].constraintrange'] !== undefined) {
          attribute = attr;
          eventData = event[0]['dimensions[' + index + '].constraintrange'];
          this.selectionRanges.set(attr, eventData);
        }
      }
    });

    var selection: Car[] = [];

    this.data.forEach(car => {
      var add = true;
      this.selectionRanges.forEach((ranges, attr) => {
        var foundInRange = false;
        ranges.forEach((range: number[]) => {
          if (car[attr as keyof Car] >= range[0] && car[attr as keyof Car] <= range[1]) {
            foundInRange = true;
          }
        });
        if (!foundInRange) {
          add = false;
        }
      });
      if (add) {
        selection.push(car);
      }
    })

    console.log("selection from pc");
    console.log(selection);
    console.log(this.selectionRanges)

    this.carService.setMainBrushingSelection(selection);

  }



}
