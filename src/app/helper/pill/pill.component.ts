import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pill',
  templateUrl: './pill.component.html',
  styleUrls: ['./pill.component.scss']
})
export class PillComponent implements OnInit {

  @Input() name: String = '';
  @Output() deleteEvent = new EventEmitter<String>();

  constructor() { }

  ngOnInit(): void {
  }

  onDelete() {
    this.deleteEvent.emit(this.name);
  }


}
