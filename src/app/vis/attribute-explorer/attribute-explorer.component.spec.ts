import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeExplorerComponent } from './attribute-explorer.component';

describe('AttributeExplorerComponent', () => {
  let component: AttributeExplorerComponent;
  let fixture: ComponentFixture<AttributeExplorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttributeExplorerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributeExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
