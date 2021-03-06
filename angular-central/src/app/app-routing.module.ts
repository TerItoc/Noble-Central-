import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { AdminEvComponent } from './admin-ev/admin-ev.component';
import { EmpleadoComponent } from './empleado/empleado.component';
import { SearchComponent } from './search/search.component';
import { SUPAUSERComponent } from './supauser/supauser.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [MsalGuard] },
  { path: 'adminEV', component: AdminEvComponent, canActivate: [MsalGuard] },
  { path: 'empleado', component: EmpleadoComponent, canActivate: [MsalGuard] },
  { path: 'search', component: SearchComponent, canActivate: [MsalGuard] },
  { path: 'superadmin', component: SUPAUSERComponent, canActivate: [MsalGuard]},
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
