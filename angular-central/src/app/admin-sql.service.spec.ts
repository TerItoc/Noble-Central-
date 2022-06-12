import { TestBed } from '@angular/core/testing';

import { AdminSqlService } from './admin-sql.service';

describe('AdminSqlService', () => {
  let service: AdminSqlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminSqlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
