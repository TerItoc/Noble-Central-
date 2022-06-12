import { TestBed } from '@angular/core/testing';

import { EmpleadoSqlService } from './empleado-sql.service';

describe('EmpleadoSqlService', () => {
  let service: EmpleadoSqlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmpleadoSqlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
