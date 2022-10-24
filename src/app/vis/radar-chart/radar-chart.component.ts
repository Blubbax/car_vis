import { Car } from './../../model/car';
import { Component, OnInit, Input, SimpleChanges } from '@angular/core';

declare const Plotly : any;

@Component({
  selector: 'app-radar-chart',
  templateUrl: './radar-chart.component.html',
  styleUrls: ['./radar-chart.component.scss']
})
export class RadarChartComponent implements OnInit {

  @Input() car: Car | undefined;
  @Input() attributes: string[] = [];

  constructor() { }

  ngOnInit(): void {
    this.drawPlot();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.drawPlot();
  }


  drawPlot() {
    var dataValues : any[] = []
    this.attributes.forEach(attribute => {
      if (this.car != null)
        dataValues.push(this.car[attribute as keyof Car]);
    })

    console.log(dataValues);

    var data = [{
      type: 'scatterpolar',
      r: dataValues,
      theta: this.attributes,
      fill: 'toself'
    }]

    var layout = {
      polar: {
        radialaxis: {
          visible: true,
          range: [0, 100]
        }
      },
      showlegend: false
    }

    Plotly.newPlot("radar", data, layout)

  }

}
