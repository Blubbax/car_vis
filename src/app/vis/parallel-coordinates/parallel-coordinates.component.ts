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
  private categoricalAxes = new Map();

  constructor(private carService:CarService) { }

  ngOnInit(): void {

    this.carService.cars.subscribe(cars => {
      this.data = cars;
      this.drawPlot();
    });

    this.carService.attributeExplorerSelection.subscribe(cars => {
      this.data = cars;
      this.drawPlot();
      var timer = window.setTimeout(function(){ }, 700);
    })

  }

  drawPlot() {
    var dimensions: { label: string; values: (string | number)[] | (number | undefined)[]; autorange: boolean; tickvals?: number[]; ticktext?: String[]; }[] = [];
    this.attributes.forEach(attribute => {
      var data = this.data.map(x => x[attribute as keyof Car]);
      var uniqueVals = this.carService.getUniqueVals(attribute);
      if (uniqueVals.size == 0) {
        // quantitative values
        dimensions.push({
          label: attribute,
          values: data,
          autorange: true
        });
      } else {
        // categorical values
        var categoricalData = data.map(element => {
          var key: String = new String(element);
          return uniqueVals.get(key.toString());
        });

        this.categoricalAxes.set(attribute, uniqueVals);

        var values: number[] = [];
        var labels: String[] = [];

        uniqueVals.forEach((value, key) => {
          if (categoricalData.includes(value)) {
            values.push(value);
            labels.push(key);
          }
        });

        dimensions.push({
          label: attribute,
          autorange: true,
          values: categoricalData,
          tickvals: values,
          ticktext: labels
        });

      }

    });


    var trace = {
      type: 'parcoords',
      line: {
        // color: 'blue'
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

    this.carService.setParallelCoordinatesSelection(this.data);
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
          if ( Array.isArray(eventData[0][0]) ) { // more than one range selected
            this.selectionRanges.set(attr, eventData[0]);
          } else {
            this.selectionRanges.set(attr, eventData);
          }
        }
      }
    });

    var selection: Car[] = [];

    this.data.forEach(car => {
      var add = true;
      this.selectionRanges.forEach((ranges, attr) => {
        var foundInRange = false;

        if (this.categoricalAxes.has(attr)) {
          // categorical

          var uniqueValues = this.categoricalAxes.get(attr);
          ranges.forEach((range: number[]) => {
            if ( uniqueValues.get(car[attr as keyof Car]) >= range[0] && uniqueValues.get(car[attr as keyof Car]) <= range[1]) {
              foundInRange = true;
            }
          });

        } else {
          // quantitative
          ranges.forEach((range: number[]) => {
            if (car[attr as keyof Car] >= range[0] && car[attr as keyof Car] <= range[1]) {
              foundInRange = true;
            }
          });
        }

        if (!foundInRange) {
          add = false;
        }
      });
      if (add) {
        selection.push(car);
      }

    })

    this.carService.setParallelCoordinatesSelection(selection);

  }

  addAttribute(attr: String) {
    this.attributes.push(attr.toString());
    this.drawPlot();
  }

  removeAttribute(event: string) {
    this.attributes = this.attributes.filter(attribute => attribute !== event);
    this.drawPlot();
  }


}
