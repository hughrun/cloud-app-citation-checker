import { Observable  } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CloudAppRestService, CloudAppEventsService, Request, HttpMethod, 
  Entity, RestErrorResponse, AlertService } from '@exlibris/exl-cloudapp-angular-lib';
import { MatRadioChange } from '@angular/material/radio';
import { TranslateService } from '@ngx-translate/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  loading = false;
  selectedEntity: Entity;
  apiResult: any;
  searchForm: FormGroup;
  
  public SEARCH_TYPE = {
    DOI: 'doi',
    METADATA: 'metadata'
  }

  entities$: Observable<Entity[]> = this.eventsService.entities$
  .pipe(tap(() => this.clear()))

  constructor(
    private restService: CloudAppRestService,
    private eventsService: CloudAppEventsService,
    private alert: AlertService,
    private fb: FormBuilder,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.searchForm = this.fb.group({
      type: this.fb.control('',[]),
      doi: this.initDOIFormGroup(),
      metadata: this.initMetadataFormGroup()
    })
  }

  ngOnDestroy(): void {
  }


  setSearchType(type: string) {
    const control: FormControl = (<any>this.searchForm).controls.type;
    control.setValue(type);
  }

  search() {

  }

  reset() {

  }

  initDOIFormGroup() {
    // DOI regex
    const regex = new RegExp("/^10.\d{4,9}/[-._;()/:A-Z0-9]+$/i");
    const group = this.fb.group({
      doi: ['', Validators.pattern(regex)]
    });

    return group;
  }

  initMetadataFormGroup() {
    // Metadata interrface
  }

  entitySelected(event: MatRadioChange) {
    const value = event.value as Entity;
    this.loading = true;
    this.restService.call<any>(value.link)
    .pipe(finalize(()=>this.loading=false))
    .subscribe(
      result => this.apiResult = result,
      error => this.alert.error('Failed to retrieve entity: ' + error.message)
    );
  }

  clear() {
    this.apiResult = null;
    this.selectedEntity = null;
  }

  update(value: any) {
    const requestBody = this.tryParseJson(value)
    if (!requestBody) return this.alert.error('Failed to parse json');

    this.loading = true;
    let request: Request = {
      url: this.selectedEntity.link, 
      method: HttpMethod.PUT,
      requestBody
    };
    this.restService.call(request)
    .pipe(finalize(()=>this.loading=false))
    .subscribe({
      next: result => {
        this.apiResult = result;
        this.eventsService.refreshPage().subscribe(
          ()=>this.alert.success('Success!')
        );
      },
      error: (e: RestErrorResponse) => {
        this.alert.error('Failed to update data: ' + e.message);
        console.error(e);
      }
    });    
  }

  private tryParseJson(value: any) {
    try {
      return JSON.parse(value);
    } catch (e) {
      console.error(e);
    }
    return undefined;
  }
}
// this will return a single object or 404 if it isn't registered with CrossRef
const crossRefDoiUrl = (doi:string) => `https://api.crossref.org/works/${doi}`;
// this will return a list of objects (with pagination)
const crossRefMetadataUrl = (query:string) => ``;