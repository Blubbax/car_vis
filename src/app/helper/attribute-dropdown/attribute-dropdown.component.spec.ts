import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeDropdownComponent } from './attribute-dropdown.component';

describe('AttributeDropdownComponent', () => {
  let component: AttributeDropdownComponent;
  let fixture: ComponentFixture<AttributeDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttributeDropdownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributeDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
