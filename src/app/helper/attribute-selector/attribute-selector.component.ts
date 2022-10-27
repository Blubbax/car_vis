import { CarService } from './../../service/car.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-attribute-selector',
  templateUrl: './attribute-selector.component.html',
  styleUrls: ['./attribute-selector.component.scss']
})
export class AttributeSelectorComponent implements OnInit {

  constructor(public carService: CarService) { }
  private selection = '';

  @Output() selectionEvent = new EventEmitter<String>();

  ngOnInit(): void {
  }

  selectAttribute() {
    if (this.selection != '') {
      console.log("submit " + this.selection)
      this.selectionEvent.emit(this.selection);
    }
  }

  changeSelection(attribute: string) {
    this.selection = attribute;
  }


}
