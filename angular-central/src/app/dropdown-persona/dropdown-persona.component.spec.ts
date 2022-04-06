import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownPersonaComponent } from './dropdown-persona.component';

describe('DropdownPersonaComponent', () => {
  let component: DropdownPersonaComponent;
  let fixture: ComponentFixture<DropdownPersonaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DropdownPersonaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownPersonaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
