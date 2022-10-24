import { Car } from './../../model/car';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.scss']
})
export class CarComponent implements OnInit {

  @Input() car : Car | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
