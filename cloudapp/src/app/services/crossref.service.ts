import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Injectable, OnDestroy } from "@angular/core";
import { InitService, CloudAppConfigService } from '@exlibris/exl-cloudapp-angular-lib';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, retry, tap } from 'rxjs/operators';
import { Configuration } from "../models/configuration";
import { CrossrefResult, CrossrefResultSet, CrossrefResponse } from "../models/crossref";

@Injectable({
    providedIn: 'root'
})
export class CrossRefService {

    private _apiCredentials: Configuration;
    private _userAgent: string;

    constructor(
        private init: InitService,
        private config: CloudAppConfigService,
        private httpClient: HttpClient
    ) {
        
        this.config.get().subscribe(settings => {
            this._apiCredentials = settings;
            this._userAgent = `ExLibris/1.0 (${this._apiCredentials.institutionUrl}; mailto:${this._apiCredentials.contactEmail})`;
        });

    }

    searchByDOI(doi: string): Observable<CrossrefResultSet> {
        console.log(doi);
        
        return this.httpClient.get(crossRefDoiUrl(doi), {
        }).pipe(
            map((response: CrossrefResponse) => {
                const body = response.message;
                console.log(body);

                let authors = [];
                Array.from(body.author).forEach((member: any) => {
                    let author = `${member.family}, ${member.given}`;
                    authors.push(author);
                });

                let resultSet: CrossrefResultSet = new CrossrefResultSet();
                let item: CrossrefResult = {
                    DOI: body.DOI,
                    ISSN: Array.from(body.ISSN).join("; "),
                    title: Array.from(body.title).join("; "),
                    author: authors.join("; "),
                    subtitle: Array.from(body.subtitle).join("; "),
                    volume: body.volume,
                    journal: body.publisher
                }
                resultSet.items.push(item);
                resultSet.results = resultSet.items.length;
                resultSet.offset = 0;
                return resultSet;
            })
        );
    }

}

// this will return a single object or 404 if it isn't registered with CrossRef
const crossRefDoiUrl = (doi:string) => `https://api.crossref.org/works/${doi}`;
// this will return a list of objects (with pagination)
const crossRefMetadataUrl = (query:string) => ``;