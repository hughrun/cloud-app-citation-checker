import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';

@Component({
    template: "{{error}}"
})

export class ErrorComponent {
    error: string;
    constructor( private route: ActivatedRoute) {}

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.error = errorMessages[params['error']] || _('Translate.Errors.GenericError');
        });
    }
}

const errorMessages = {
    'NO_ACCESS': _('Translate.Errors.NoAccess')
}

export enum ErrorMessages {
    NO_ACCESS = 'NO_ACCESS'
}