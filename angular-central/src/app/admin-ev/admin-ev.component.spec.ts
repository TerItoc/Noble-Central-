import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEvComponent } from './admin-ev.component';

describe('AdminEvComponent', () => {
  let component: AdminEvComponent;
  let fixture: ComponentFixture<AdminEvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminEvComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminEvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
