import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { DashboardSqlService } from '../dashboard-sql.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MsalBroadcastService } from '@azure/msal-angular';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import {
  EventMessage,
  EventType,
  InteractionStatus,
} from '@azure/msal-browser';
import { filter } from 'rxjs/operators';
import { Empleado } from '../model/empleado.model'
import { Equipo } from '../model/equipos.model';

const GRAPH_POINT = 'https://graph.microsoft.com/v1.0/me';

type ProfileType = {
  givenName?: string;
  surname?: string;
  userPrincipalName?: string;
  id?: string;
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  profile!: ProfileType;
  counter: number = 0;

  huerfanos = [];
  equipos = [];
  arrEmpleados: string[];

  isAdmin: boolean = false;
  ifTeam: boolean = false;
  loading: boolean = true;
  validando: boolean = true;

  @ViewChild('Huerfanos') Huer: any;

  StatusArray: any;
  
  //Search Variables Start
  emp: Empleado[]
  emps : any;
  
  equiposSearch = [];
  huerfanosSearch = [];

  equiposSearchTemp = [];
  huerfanosSearchTemp = [];

  searchActive: boolean = false;
  //SearchVariables End


  constructor(
    private dsqls: DashboardSqlService,
    private msalBroadcastService: MsalBroadcastService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.http.get(GRAPH_POINT).subscribe((profile) => {
      this.profile = profile;

      this.dsqls.getIsAdmin(this.profile.userPrincipalName).subscribe((msg) => {
        let value = Object.values(msg)[0];
        if (value === 'No hay correo' || value === 'false') {
          this.isAdmin = false;
          this.router.navigateByUrl('empleado');
        } else {
          this.isAdmin = true;
          this.createTeams();
          this.getStatus();
        }
      });

    this.dsqls.getEmps().subscribe(empleados => {
      this.emp = empleados
      this.dsqls.empData = empleados
    });
  });}

  refresh(): void {
    window.location.reload();
  }

  publishTeams() {
    this.loading = true;
    this.dsqls.publishTeams().subscribe((res) => {
      this.loading = false;
      this.refresh();
    });
  }

  saveTeams() {}

  goBottom() {
    window.scrollTo(0, document.body.scrollHeight);
  }

  goTop() {
    window.scrollTo(0, 0);
  }

  search(): void {
    this.router.navigateByUrl('/search');
  }

  createTeams() {
    this.loading = true;
    this.dsqls.getIfTeam().then((res) => {
      this.ifTeam = res;

      if (this.ifTeam) {
        this.dsqls.getValidando().then((res) => {
          this.validando = res;
        });

        this.dsqls.getTeams().subscribe((res) => {
          this.equipos = res;
        });

        this.dsqls.getEmployees().subscribe((res) => {
          this.arrEmpleados = res.sort();
        });

        this.dsqls.getOrphans().subscribe((res) => {
          this.huerfanos = res;
          this.loading = false;
        });
      } else {
        this.router.navigateByUrl('adminEV');
      }
    });
  }

  getStatus() {
    this.dsqls.getStatusTotal().subscribe((arrStatus) => {
      this.dsqls.getOrphans().subscribe((arrOrphan) => {
        arrStatus.push({
          name: 'Unassigned',
          value: arrOrphan.length,
        });
        this.StatusArray = arrStatus;
      });
    });
  }

  goTarget(el: HTMLElement) {
    el.scrollIntoView();
  }

  /*   onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  } */
  //Search Functions Start
  onSelectedOption(e) {
    
    this.getFilteredExpenseList();
  }

  getFilteredExpenseList() {
    if (this.dsqls.searchOption.length > 0){
      this.emp = this.dsqls.filteredListOptions();
      this.emp.forEach(el => {
      this.getTeamForName(el);
      this.searchActive = true;
      });
    }else {
      this.emp = this.dsqls.empData;
      this.searchActive = false;
    }
    this.equiposSearch = [];
    this.huerfanosSearch = [];
  }

  getTeamForName(nom){
    this.dsqls.getTeams().subscribe((res) => {
      if (res.filter(e => e.nombre === nom)){
      this.equiposSearch = this.equiposSearch.concat(res.filter(e => e.nombre === nom));
      this.equiposSearchTemp = this.equiposSearchTemp.concat(res.filter(e => e.nombre === nom));
      console.log(this.equiposSearch);
      }
    });

    this.dsqls.getOrphans().subscribe((res) => {
      if (res.filter(e => e.nombreHuerfano === nom)){
      this.huerfanosSearch = this.huerfanosSearch.concat(res.filter(e => e.nombreHuerfano === nom));
      //console.log(this.huerfanosSearch);
      }
    }); 
  }
  //Search Functions End

}
