import { Component, Injectable, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CloudAppConfigService, AlertService, CloudAppEventsService, CloudAppRestService } from '@exlibris/exl-cloudapp-angular-lib';
import { CanActivate, Router } from '@angular/router';
import { Observable, iif, of, isObservable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ErrorMessages } from '../static/error.component';
import { TranslateService } from '@ngx-translate/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})

export class ConfigurationComponent implements OnInit {

  form: FormGroup;
  saving = false;
  urlPattern: RegExp = /^(https?):\/*(?:[^:@]+(?::[^@]+)?@)?(?:[^\s:/?#]+|\[[a-f\d:]+])(?::\d+)?(?:\/[^?#]*)?(?:\?[^#]*)?(?:#.*)?$/i;

  constructor(
    private appService: AppService,
    private fb: FormBuilder,
    private configService: CloudAppConfigService,
    private alert: AlertService,
    private translate: TranslateService,
    private router: Router
  ) { }

  ngOnInit() {

    this.translate.get('Translate.Configuration.Title').subscribe(text => this.appService.setTitle(text));

    this.form = this.fb.group({
      institutionUrl: this.fb.control('', [Validators.required, Validators.pattern(this.urlPattern)]),
      contactEmail: this.fb.control('', [Validators.required, Validators.email])
    });
    this.load();
  }

  load() {
    this.saving = true;
    this.configService.getAsFormGroup().subscribe(config => {
      if (Object.keys(config.value).length != 0) {
        this.form = config;
      }
    }, err => this.alert.error(err.message),
      () => this.saving = false
    );
  }

  save() {

    if (this.form.invalid) {
      this.alert.error(this.translate.instant('Translate.Configuration.InvalidForm'));
      return;
    }

    this.saving = true;

    this.configService.set(this.form.value).subscribe(
      () => {
        this.alert.success(this.translate.instant('Translate.Configuration.SavedSuccessfully'));
        this.form.markAsPristine();
      },
      err => this.alert.error(err.message),
      () => this.saving = false
    );
  }

  onLoadOrReset() {
    this.load();
  }

  get contactEmail() { return this.form.get('contactEmail') }
  get institutionUrl() { return this.form.get('institutionUrl') }

  getEmailErrorMessage() {

    if (this.contactEmail.hasError('required')) {
      return this.translate.instant('Translate.Errors.ValueMissing');
    }

    else if (this.contactEmail.hasError('email')) {
      return this.translate.instant('Translate.Errors.InvalidEmail')
    }

    else return this.translate.instant('Translate.Errors.InvalidValue');
  }

  getUrlErrorMessage() {

    if (this.institutionUrl.hasError('required')) {
      return this.translate.instant('Translate.Errors.ValueMissing');
    }

    else if (this.institutionUrl.hasError('url')) {
      return this.translate.instant('Translate.Errors.InvalidInstitutionURL');
    }

    else return this.translate.instant('Translate.Errors.InvalidValue');
  }

}


@Injectable({
  providedIn: 'root',
})
export class ConfigurationGuard implements CanActivate {
  constructor(
    private eventsService: CloudAppEventsService,
    private restService: CloudAppRestService,
    private router: Router
  ) { }

  // only general site administrators can access this page
  canActivate(): Observable<boolean> {
    return this.eventsService.getInitData().pipe(
      switchMap(initData => this.restService.call(`/users/${initData.user.primaryId}`)),
      map(user => {
        if (!user.user_role.some(role => role.role_type.value = 'GenAdmin')) {
          this.router.navigate(['/error'], {
            queryParams: { error: ErrorMessages.NO_ACCESS }
          });
          return false;
        }
        return true;
      })
    )
  }
}