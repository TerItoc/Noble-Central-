import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { DashboardSqlService } from '../dashboard-sql.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Empleado } from '../model/empleado.model';

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

  isAdmin: boolean = false;
  ifTeam: boolean = false;
  loading: boolean = true;
  validando: boolean = true;
  isHidden: boolean = false;
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
  //END GRAPH

  //Search Variables Start
  emp: Empleado[];
  emps: any;

  equiposSearch = [];
  huerfanosSearch = [];

  huerfanosSearchTemp = [];

  searchActive: boolean = false;
  //SearchVariables End

  constructor(
    private dsqls: DashboardSqlService,
    private router: Router,
    private http: HttpClient
  ) {}

ngOnInit(): void {
  this.createTeams();
  this.innerWidth = window.innerWidth;
  this.innerHeight = window.innerHeight;

    /*this.dsqls.getEmployees().subscribe(empleados => {
      this.emp = empleados;
      this.dsqls.empData = empleados;
    })*/
    //this.getStatus();
    /* this.http.get(GRAPH_POINT).subscribe((profile) => {
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

      this.dsqls.getEmps().subscribe((empleados) => {
        this.emp = empleados;
        this.dsqls.empData = empleados;
      });
    }); */
  }

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

        this.dsqls.getEmps().subscribe((res) => {
          this.emp = res;
          this.dsqls.empData = res;
          this.arrEmpleados = res.sort();
        });

        this.dsqls.getStatusTotal().subscribe(async (arrStatus) => {
          this.dsqls.getOrphans().subscribe(async (res) => {
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

  //Search Functions Start
  onSelectedOption(e) {
    this.getFilteredExpenseList();
  }

  getFilteredExpenseList() {
    if (this.dsqls.searchOption.length > 0) {
      this.emp = this.dsqls.filteredListOptions();
      this.emp.forEach((el) => {
        this.getTeamForName(el);
        this.searchActive = true;
        this.isHidden = true;
      });
    } else {
      this.emp = this.dsqls.empData;
      this.searchActive = false;
      this.isHidden = false;
    }
    this.equiposSearch = [];
    this.huerfanosSearch = [];
  }

  getTeamForName(nom) {
    this.dsqls.getTeams().subscribe((res) => {
      if (res.filter((e) => e.nombre === nom)) {
        this.equiposSearch = this.equiposSearch.concat(
          res.filter((e) => e.nombre === nom)
        );
        return;
      }
      this.dsqls.getOrphans().subscribe((res) => {
        if (res.filter((e) => e.nombreHuerfano === nom)) {
          this.huerfanosSearch = this.huerfanosSearch.concat(
            res.filter((e) => e.nombreHuerfano === nom)
          );
        }
      });
    });
  }
  //Search Functions End
}
