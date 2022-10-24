import { Car } from './../../model/car';
import { CarService } from './../../service/car.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-visualization',
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.scss']
})
export class VisualizationComponent implements OnInit {

  public carData : Car[] = [];
  public selectedCar : Car | undefined;

  constructor(private carService : CarService) {
    this.carService.cars.subscribe(cars => {
      this.carData = cars;
    })

    this.carService.selectedCar.subscribe(car => {
      this.selectedCar = car;
    })

  }

  ngOnInit(): void {
  }

}
