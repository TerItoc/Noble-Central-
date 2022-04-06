import { TestBed } from '@angular/core/testing';

import { DashboardSqlService } from './dashboard-sql.service';

describe('DashboardSqlService', () => {
  let service: DashboardSqlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardSqlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
