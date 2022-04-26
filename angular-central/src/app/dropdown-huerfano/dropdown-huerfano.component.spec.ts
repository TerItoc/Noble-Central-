import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownHuerfanoComponent } from './dropdown-huerfano.component';

describe('DropdownHuerfanoComponent', () => {
  let component: DropdownHuerfanoComponent;
  let fixture: ComponentFixture<DropdownHuerfanoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DropdownHuerfanoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownHuerfanoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
