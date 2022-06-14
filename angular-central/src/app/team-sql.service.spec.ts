import { TestBed } from '@angular/core/testing';

import { TeamSqlService } from './team-sql.service';

describe('TeamSqlService', () => {
  let service: TeamSqlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeamSqlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
