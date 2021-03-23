import { Observable  } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { Component, OnInit, OnDestroy, Injectable } from '@angular/core';
import { CloudAppRestService, CloudAppEventsService, Request, HttpMethod, 
  Entity, RestErrorResponse, AlertService, EntityType, PageInfo } from '@exlibris/exl-cloudapp-angular-lib';
import { MatRadioChange } from '@angular/material/radio';
import { TranslateService } from '@ngx-translate/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CrossRefService } from '../services/crossref.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  loading = false;
  selectedEntity: Entity;
  searchResults = null;
  searchForm: FormGroup;

  public SEARCH_TYPE = {
    DOI: 'doi',
    METADATA: 'metadata'
  }

  constructor(
    private restService: CloudAppRestService,
    private eventsService: CloudAppEventsService,
    private alert: AlertService,
    private translate: TranslateService,
    private crossRefService: CrossRefService
  ) { }

  ngOnInit() {
    this.searchForm = new FormGroup({
      type: new FormControl('',[]),
      doi: this.initDOIFormGroup(),
      metadata: this.initMetadataFormGroup()
    })
    console.log(this.searchForm)
  }

  ngOnDestroy(): void {
  }


  setSearchType(type: string) {
    const control: FormControl = (<any>this.searchForm).controls.type;
    control.setValue(type);
  }

  get searchType(): FormControl { return (<any>this.searchForm).controls.type; }
  get doiSearch(): FormControl { return (<any>this.searchForm).controls.doi.controls.doiSearch; }

  search() {

    if (this.searchType.value === this.SEARCH_TYPE.DOI) {
      this.loading = true;
      this.crossRefService.searchByDOI(this.doiSearch.value).subscribe({
        next: (resp) => {
          console.log(resp);
          this.searchResults = resp;
          this.loading = false;
        },
        error: (e: HttpErrorResponse) => {
          this.alert.error('Failed to retrieve data: ' + e.message);
          console.error(e);
          this.loading = false;
        }
      });
    }

    if (this.searchType.value === this.SEARCH_TYPE.METADATA) {

    }

  }

  reset() {
    this.doiSearch.setValue(null);
    this.searchForm.markAsUntouched();
  }

  initDOIFormGroup() {
    // DOI regex
    const regex = /^10.\d{4,9}\/[-._;()/:A-Z0-9]+$/i;
    const group = new FormGroup({
      doiSearch: new FormControl('', [Validators.required, Validators.pattern(regex)])
    });

    return group;
  }

  initMetadataFormGroup() {
    // only displaying an empty form group for now
    return new FormGroup({})
  }

  private tryParseJson(value: any) {
    try {
      return JSON.parse(value);
    } catch (e) {
      console.error(e);
    }
    return undefined;
  }

  getDoiSearchErrorMessage() {
    
    if (this.doiSearch.hasError('required')) {
      return this.translate.instant('Translate.Errors.ValueMissing');
    }

    if (this.doiSearch.hasError('pattern')) {
      return this.translate.instant('Translate.Errors.InvalidDOI');
    } 

    return this.translate.instant('Translate.Errors.InvalidValue');
  }

}