import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DashboardSqlService } from '../dashboard-sql.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { EventMessage, EventType, InteractionStatus } from '@azure/msal-browser';
import { filter } from 'rxjs';

type ProfileType = {
  givenName?: string;
  surname?: string;
  userPrincipalName?: string;
  id?: string; 
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

//TODO Modificar para que se despliegue la informacion por empleado
export class DashboardComponent implements OnInit {

  loginDisplay = false;
  profile!: ProfileType;

  constructor(
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.msalBroadcastService.msalSubject$
    .pipe(
      filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS)
    )
    .subscribe((result: EventMessage) => {
      console.log(result);
    });

    this.msalBroadcastService.inProgress$
    .pipe(
      filter((status: InteractionStatus) => status === InteractionStatus.None)
    )
    .subscribe(() => {
      this.getProfile()
      this.setLoginDisplay();
      this.getProfile();
    })
  constructor(private dsqls : DashboardSqlService,private router:Router) {};

  huerfanos = [];
  equipos = [];
  counter: number = 0;
  loading: boolean = true;
  arrEmpleados: string[];

  ifTeam : boolean = false;

  ngOnInit(): void {
    this.loading=true;

    this.dsqls.getIfTeam().then(res => {
      this.ifTeam = res;

      if(this.ifTeam){
        this.dsqls.getTeams().subscribe(res => {
          this.equipos = res;
        });
    
        this.dsqls.getEmployees().subscribe(res => {
          this.arrEmpleados = res.sort();
        })
    
        this.dsqls.getOrphans().subscribe(res => {
          this.huerfanos = res;
          this.loading = false;
        });
      }
  
      else{
        this.router.navigateByUrl('adminEV')
      }
    })
  }

  goBottom(){
    window.scrollTo(0,document.body.scrollHeight);
  }

  goTop(){
    window.scrollTo(0,0);
  }

  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }

  getProfile() {
    this.http.get("https://graph.microsoft.com/v1.0/me")
    .subscribe(profile => {
      this.profile = profile;
    });
  }

  logout() {
    this.authService.logoutRedirect({
      postLogoutRedirectUri: 'http://localhost:4200/login'
    })
  }
}
