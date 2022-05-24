import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SUPAUSERComponent } from './supauser.component';

describe('SUPAUSERComponent', () => {
  let component: SUPAUSERComponent;
  let fixture: ComponentFixture<SUPAUSERComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SUPAUSERComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SUPAUSERComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
