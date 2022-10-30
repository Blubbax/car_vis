import { Car } from './../../model/car';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.scss']
})
export class CarComponent implements OnInit {

  @Input() car : Car | undefined;
  @Input() attributes : string[] = [];
  @Output() toggleDetailsEvent = new EventEmitter();

  public detailsVisisble = false;

  constructor() { }

  ngOnInit(): void {
  }

  getAttributeValue(attribute: string) {
    if (this.car !== undefined) {
      return this.car[attribute as keyof Car];
    }
    return "";
  }

  toggleDetails() {
    this.detailsVisisble = !this.detailsVisisble;
    this.toggleDetailsEvent.emit();
  }

}
