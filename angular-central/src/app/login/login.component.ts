import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MsalBroadcastService, MsalGuard, MsalGuardConfiguration, MsalService, MSAL_GUARD_CONFIG } from '@azure/msal-angular';
import { InteractionStatus, RedirectRequest } from '@azure/msal-browser';
import { filter, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginDisplay = false;
  private readonly _destroying$ = new Subject<void>();

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private broadcastService: MsalBroadcastService,
    private authService: MsalService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.broadcastService.inProgress$
    .pipe(
      filter(
        (status: InteractionStatus) => status === InteractionStatus.None
      ),
      takeUntil(this._destroying$)
    )
    .subscribe(() => {
      this.setLoginDisplay();
      if(this.loginDisplay) this.router.navigateByUrl('dashboard');
    })
  }

  login() {
    if(this.msalGuardConfig.authRequest) {
      this.authService.loginRedirect({...this.msalGuardConfig.authRequest} as RedirectRequest);
    } else {
      this.authService.loginRedirect();
    }
  }

  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }

  ngOnDestroy(): void {
      this._destroying$.next(undefined);
      this._destroying$.complete();
  }
}
