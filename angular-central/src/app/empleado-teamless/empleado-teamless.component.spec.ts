import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpleadoTEAMLESSComponent } from './empleado-teamless.component';

describe('EmpleadoTEAMLESSComponent', () => {
  let component: EmpleadoTEAMLESSComponent;
  let fixture: ComponentFixture<EmpleadoTEAMLESSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpleadoTEAMLESSComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpleadoTEAMLESSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
