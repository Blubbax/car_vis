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
  private categories: Set<string|number> = new Set();
  private selectedCategories: Set<string|number> = new Set();

  private selectedCar: Car|undefined;

  constructor(
    private carService:CarService,
    private elRef:ElementRef) { }

  ngOnInit(): void {
    this.carService.parallelCoordinatesSelection.subscribe(cars => {
      this.data = cars;
      this.drawPlot();
    });

    this.carService.selectedCar.subscribe(car => {
      this.selectedCar = car;
    })
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

      this.categories = new Set(this.data.map(car => car[this.categoricalAttribute as keyof Car]));
      this.categories.forEach(value => {

        this.selectedCategories.add(value);

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
        title: this.xAttribute,
        autorange: true
      },
      yaxis: {
        range: this.carService.getRange(this.yAttribute),
        title: this.yAttribute,
        autorange: true
      },
      title: this.title,
      autoscale: true
    };

    var config = {responsive: true}


    Plotly.newPlot('scatterplot', data, layout, config);

    (document.getElementById('scatterplot') as any).on('plotly_hover', this.onDataHovering.bind(this));
    (document.getElementById('scatterplot') as any).on('plotly_selected', this.onDataBrushing.bind(this));
    (document.getElementById('scatterplot') as any).on('plotly_deselect', this.onDataBrushingReset.bind(this));
    (document.getElementById('scatterplot') as any).on('plotly_legendclick', this.onLegendSelection.bind(this));
    (document.getElementById('scatterplot') as any).on('plotly_legenddoubleclick', this.onLegendSelectionReset.bind(this));
  }

  onDataBrushing(event:any) {

    var selection: Car[] = [];

    if (event == undefined) {
      this.carService.resetScatterPlotSelection();
      return;
    }

    event.points.forEach((point: { x: string | number; y: string | number; }) => {
      this.data
        .filter(car => {
          if (car[this.xAttribute as keyof Car] == point.x && car[this.yAttribute as keyof Car] == point.y) {
            if (this.categoricalAttribute != "") {
              if (this.selectedCategories.has(car[this.categoricalAttribute as keyof Car])) {
                return true;
              }
            } else {
              return true;
            }
          }
          return false;
        })
        .forEach(car => {
          if (!selection.includes(car)) {
            selection.push(car);
          }
        });
    });

    console.log("scatter selection")
    console.log(selection)
    this.carService.setScatterPlotSelection(selection);

  }

  onDataHovering(event:any) {
    this.carService.selectCar(
      this.data
        .filter(car => car[this.xAttribute as keyof Car] == event.points[0].x && car[this.yAttribute as keyof Car] == event.points[0].y)[0]
    );
  }

  onDataBrushingReset(event: any) {
    console.log(event);
    if (this.categoricalAttribute != "") {
      console.log("reset A")
      this.filterLegendSelection();
    } else {
      console.log("reset B")
      this.carService.setScatterPlotSelection(this.data);
    }
  }

  onLegendSelection(event: any) {

    var selectedIndex:number = event.curveNumber;
    var selectedCategory = Array.from(this.categories)[selectedIndex];

    if (this.selectedCategories.has(selectedCategory)) {
      this.selectedCategories.delete(selectedCategory);
    } else {
      this.selectedCategories.add(selectedCategory);
    }

    this.filterLegendSelection();
  }

  onLegendSelectionReset(event: any) {

    var selectedIndex:number = event.curveNumber;
    var selectedCategory = Array.from(this.categories)[selectedIndex];

    if (this.selectedCategories.has(selectedCategory)) {
      if (this.selectedCategories.size > 1) {
        // add just this one
        this.selectedCategories.clear();
        this.selectedCategories.add(selectedCategory);
      } else {
        this.categories.forEach(cat => this.selectedCategories.add(cat));
      }
    } else {
      // add all
      this.categories.forEach(cat => this.selectedCategories.add(cat));
    }

    this.filterLegendSelection();
  }

  filterLegendSelection() {

    var selection: Car[] = []

    this.data.forEach(car => {
      if (this.selectedCategories.has(car[this.categoricalAttribute as keyof Car])) {
        selection.push(car);
      }
    });

    this.carService.setScatterPlotSelection(selection);

  }


}
