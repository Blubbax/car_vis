import { CarService } from './../../service/car.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-attribute-dropdown',
  templateUrl: './attribute-dropdown.component.html',
  styleUrls: ['./attribute-dropdown.component.scss']
})
export class AttributeDropdownComponent implements OnInit {

  @Input() defaultAttribute: string = '';
  @Input() emptyAllowed: boolean = false;
  @Input() categorical: boolean = false;
  @Input() title: string = '';
  @Output() attributeChangeEvent = new EventEmitter<string>();

  constructor(public carService: CarService) { }

  ngOnInit(): void {
  }

  changeSelection(attribute: string) {
    this.attributeChangeEvent.emit(attribute);
  }

  getAttributes() {
    if (this.categorical) {
      return this.carService.categoricalAttributes;
    }
    return this.carService.attributes;
  }

}
