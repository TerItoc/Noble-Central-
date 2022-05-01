import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { AdminEvComponent } from './admin-ev/admin-ev.component';
import { EmpleadoComponent } from './empleado/empleado.component';
import { EmpleadoDashboardComponent } from './empleado-dashboard/empleado-dashboard.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [MsalGuard] },
  { path: 'adminEV', component: AdminEvComponent, canActivate: [MsalGuard] },
  { path: 'empleado', component: EmpleadoComponent, canActivate: [MsalGuard] },
  { path: 'empleado-dashboard', component: EmpleadoDashboardComponent, canActivate: [MsalGuard] },
  { path: '**', redirectTo: 'login' },
];

const isIframe = window !== window.parent && !window.opener;

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: !isIframe ? 'enabled' : 'disabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
