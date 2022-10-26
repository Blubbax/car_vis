import { CarService } from './../../service/car.service';
import { Car } from './../../model/car';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-attribute-explorer',
  templateUrl: './attribute-explorer.component.html',
  styleUrls: ['./attribute-explorer.component.scss']
})
export class AttributeExplorerComponent implements OnInit {

  @Input() attributes: String[] = [];

  public data: Car[] = [];
  private sliderSelections = new Map();

  constructor(private carService: CarService) {
    this.carService.cars.subscribe(cars => {
      this.data = cars;
      this.attributes.forEach(attr => {
        this.sliderSelections.set(attr, cars);
      })
    });
  }

  ngOnInit(): void {
  }

  onSelection(selection: Car[], source: String) {
    this.sliderSelections.set(source, selection);

    selection = this.data.filter(car => {
      var add = true;
      this.sliderSelections.forEach((selection: Car[], key) => {
        var found = false
        selection.forEach(selcar => {
          if (selcar == car) {
            found = true;
          }
        })
        if (!found) {
          add = false;
        }
      })
      return add;
    });

    this.carService.setBrushingSelection(selection);

  }

}
