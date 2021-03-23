export type CrossrefResponse = {
    status: string;
    "message-type": string;
    "message-version": string;
    message: any;
}

export class CrossrefResult {
    DOI: string;
    ISSN: string;
    author: string;
    title: string;
    subtitle: string;
    volume: string;
    journal: string;
}

export class CrossrefResultSet {
    results?: number;
    offset?: number;
    items: Array<CrossrefResult> = [];
}