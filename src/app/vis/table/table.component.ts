import { CarService } from './../../service/car.service';
import { Car } from './../../model/car';
import { Component, OnInit, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  @Input() public data : Car[] = [];
  @Input() attributes : string[] = [];

  private currentSortAttribute : string = '';

  constructor(private carService:CarService) { }

  ngOnInit(): void {
    this.carService.cars.subscribe(cars => {
      this.data = cars;
    });

    this.carService.brushingSelection.subscribe(cars => {
      this.data = cars;
    })

    this.carService.mainBrushingSelection.subscribe(cars => {
      this.data = cars;
    });

  }

  getAttributeOfCar(car:Car, attribute:string) : any {
    return car[attribute as keyof Car]
  }

  selectCar(car:Car) {
    this.carService.selectCar(car);
  }

  sort(attribute: string) {
    if (this.currentSortAttribute == attribute) {
      this.data.reverse();
    } else {
      this.data.sort((carA, carB) => {
        if (carA[attribute as keyof Car] < carB[attribute as keyof Car]) {
          return -1;
        } else if (carA[attribute as keyof Car] > carB[attribute as keyof Car]) {
          return 1;
        } else {
          return 0;
        }
      });
    }
    this.currentSortAttribute = attribute;

  }

}
