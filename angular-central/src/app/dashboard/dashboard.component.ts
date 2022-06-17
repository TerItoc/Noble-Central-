import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { DashboardSqlService } from '../dashboard-sql.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Empleado } from '../model/empleado.model';
import { Toast } from 'ngx-toastr';
import { subscribeOn } from 'rxjs';
import { TeamSqlService } from '../team-sql.service';
import { AdminSqlService } from '../admin-sql.service';
import { EmpleadoSqlService } from '../empleado-sql.service';

import { Evaluacion } from '../model/equipos.model';
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
  arrEmpleados: Empleado[];

  evaluadores: Evaluacion[];
  evals = [];
  equiposMod: Equipo[];

  isAdmin: boolean = false;
  ifTeam: boolean = false;
  loading: boolean = true;
  validando: boolean = true;
  isHidden: boolean = false;
  isHidden2: boolean = false;
  innerWidth: number;
  innerHeight: number;

  @ViewChild('Huerfanos') Huer: any;
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = event.target.innerWidth;
    this.innerHeight = event.target.innerHeight;
  }

  //GRAPH
  StatusArray: any;
  colorScheme = [
    {
      name: 'Pendiente',
      value: '#FDDA0D',
    },
    {
      name: 'Validando',
      value: '#008000',
    },
    {
      name: 'Reporte',
      value: '#FF0000',
    },
    {
      name: 'Unassigned',
      value: '#808080',
    },
  ];

  //Search Variables Start
  emp: Empleado[];
  emps: any;

  equiposSearch = [];
  huerfanosSearch = [];

  equiposList = [];
  huerfanosList = [];

  pendingTeams = [];
  validTeams = [];
  reportTeams = [];

  searchActive: boolean = false;
  //SearchVariables End

  constructor(
    private dashboardSql: DashboardSqlService,
    private teamSql: TeamSqlService,
    private adminSql: AdminSqlService,
    private employeeSql: EmpleadoSqlService,
    private toastr: ToastrService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;

    this.http.get(GRAPH_POINT).subscribe((profile) => {
      this.profile = profile;

      this.adminSql.getIsAdmin(this.profile.userPrincipalName).subscribe((msg) => {
        let value = Object.values(msg)[0];
        if (value === 'No hay correo' || value === 'false') {
          this.router.navigateByUrl('empleado');
        } else {
          this.createTeams();
          this.getStatus();
        }
      });

      this.employeeSql.getEmps().subscribe((empleados) => {
        this.emp = empleados;
        this.dashboardSql.empData = empleados;
      });
    });

    this.teamSql.getTeams().subscribe((res) => {
      this.equiposList = res;
      this.equiposMod = res;
    });

    this.teamSql.getOrphans().subscribe((res) => {
      this.huerfanosList = res;
    });

  }

  refresh(): void {
    window.location.reload();
  }

  publishTeams() {
    this.loading = true;
    this.teamSql.publishTeams().subscribe((res) => {
      this.loading = false;
      this.refresh();
    });
  }

  saveTeams() {
    try {
      this.teamSql.getTeamsMatrix().subscribe((res) => {
        var csvContent = 'data:text/csv;charset=utf-8,';

        for (let i = 0; i < res['length']; i++) {
          const infoArray = res[i].map((x) => {
            if (x == null) {
              return 'N/A';
            } else {
              return x.toString().replace(',', '');
            }
          });

          const dataString = infoArray.join(',');
          csvContent += dataString + '\n';
        }

        var encodedUri = encodeURI(csvContent);
        var link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'Evaluaciones360.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
      this.toastr.success('', 'Se creo el archivo correctamente');
    } catch (error) {
      this.toastr.error('', 'Hubo un error al crear archivo');
    }
  }

  goBottom() {
    window.scrollTo(0, document.body.scrollHeight);
  }

  goTop() {
    window.scrollTo(0, 0);
  }

  createTeams() {
    this.loading = true;
    this.teamSql.getIfTeam().then((res) => {
      this.ifTeam = res;

      if (this.ifTeam) {
        this.teamSql.getValidando().then((res) => {
          this.validando = res;
        });

        this.teamSql.getTeams().subscribe((res) => {
          this.equipos = res;
        });

        this.employeeSql.getEmps().subscribe((res) => {
          this.emp = res;
          this.dashboardSql.empData = res;
          this.arrEmpleados = res.sort();
        });

        this.dashboardSql.getStatusTotal().subscribe(async (arrStatus) => {
          this.teamSql.getOrphans().subscribe(async (res) => {
            arrStatus.push({
              name: 'Unassigned',
              value: res.length,
            });
            this.StatusArray = arrStatus;
            this.huerfanos = res;
            this.loading = false;
          });
        });
      } else {
        this.router.navigateByUrl('adminEV');
      }
    });
    this.pending();
  }

  getStatus() {
    this.dashboardSql.getStatusTotal().subscribe((arrStatus) => {
      this.teamSql.getOrphans().subscribe((arrOrphan) => {
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

  //Search Functions Start
  onSelectedOption(e) {
    this.getFilteredExpenseList();
  }

  getFilteredExpenseList() {
    if (this.dashboardSql.searchOption.length > 0) {
      this.emp = this.dashboardSql.filteredListOptions();

      this.employeeSql.getEmployees().subscribe((res) => {
        this.emp.forEach((el) => {
          this.getTeamForName(el);
          this.searchActive = true;
          this.isHidden = true;
        });
      });
    } else {
      this.emp = this.dashboardSql.empData;
      this.searchActive = false;
      this.isHidden = false;
    }

    this.equiposSearch = [];
    this.huerfanosSearch = [];
  }

  getTeamForName(nom) {
    if (this.equiposList.filter((e) => e.nombre === nom)) {
      this.equiposSearch = this.equiposSearch.concat(
        this.equiposList.filter((e) => e.nombre === nom)
      );
    }
    if (this.huerfanosList.filter((e) => e.nombre === nom)) {
      this.huerfanosSearch = this.huerfanosSearch.concat(
        this.huerfanosList.filter((e) => e.nombreHuerfano === nom)
      );
    }
  }

  pending(){
    this.equiposMod.forEach(element1 => {
      element1.evaluadores.forEach(element2 => {
        if(0 === element2.Estatus){
          this.pendingTeams.push(element1.nombre);
        }
      });
    });
    
    this.equiposMod.forEach(element1 => {
      element1.evaluadores.forEach(element2 => {
        if(1 === element2.Estatus){
          this.validTeams.push(element1.nombre);
        }
      });
    });

    this.equiposMod.forEach(element1 => {
      element1.evaluadores.forEach(element2 => {
        if(2 === element2.Estatus){
          this.reportTeams.push(element1.nombre);
        }
      });
    });

    this.pendingTeams = this.pendingTeams.filter(function(elem, index, self) {
      return index === self.indexOf(elem);
    })
    this.validTeams = this.validTeams.filter(function(elem, index, self) {
      return index === self.indexOf(elem);
    })
    this.reportTeams = this.reportTeams.filter(function(elem, index, self) {
      return index === self.indexOf(elem);
    })
  }

  noFilter(){
    this.teamSql.getTeams().subscribe((res) => {
      this.equipos = res;
      this.isHidden2 = false;
      this.teamSql.getOrphans().subscribe(async (res) => {
        this.huerfanos = res;
      });
    });
  }

  pendingDisplay(){

    this.isHidden2 = true;

    this.equipos = [];
    this.huerfanos = [];

    this.employeeSql.getEmployees().subscribe((res) => {
      this.pendingTeams.forEach(element => {
        this.getTeamForName2(element);
      });
    });
  }

  validDisplay(){
    
    this.isHidden2 = true;
    
    this.equipos = [];
    this.huerfanos = [];
    
    this.employeeSql.getEmployees().subscribe((res) => {
      this.validTeams.forEach(element => {
        this.getTeamForName2(element);
      });
    });
  }

  reportDisplay(){
    
    this.isHidden2 = true;
    
    this.equipos = [];
    this.huerfanos = [];
    
    this.employeeSql.getEmployees().subscribe((res) => {
      this.reportTeams.forEach(element => {
        this.getTeamForName2(element);
      });
    });
  }

  getTeamForName2(nom) {
    if (this.equiposList.filter((e) => e.nombre === nom)) {
      this.equipos = this.equipos.concat(
        this.equiposList.filter((e) => e.nombre === nom)
      );
    }
  }

  //Search Functions End
}
