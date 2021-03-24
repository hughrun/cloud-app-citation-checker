This is a Cloud App for [Ex Libris](https://github.com/ExLibrisGroup) Alma library software. This is also very much a work in progress!

---

## PURPOSE

This Alma cloud app interoperates with Alma's Resource Sharing forms: Books and Articles

Alma staff may use the app to either:

Enter a DOI into the DOI field (Article form only). The app will then attempt to match the DOI against CrossRef. If a match is found that record is displayed. The end user may then either accept or reject the record. If accepted, the form is populated with data elements from the matched record. For new requests staff processing time is minimsed.

OR

Use the app to attempt to match other bibliographic elements against CrossRef. Matched records are displayed in order of relevancy. The end user may then either select the required record or reject all records. If accepted, the form is populated with data elements from the matched record.

Both app actions enhance the accuracy of the details in the form therefore the request is more likely to be filled in a timely fashion.

### Alma navigation:

Fulfillment > Resource Sharing / Borrowing Requests
Then either edit the request that requires validation OR add a new request (> Add > Manually > select Book or Article).

### Use cases

* Pre-filling of the request form where the DOI is known.  Saves staff staff and enhances accuracy.
* Patrons may have submitted bad citation data for requesting resources via Rapid ILL.
* Sometimes citation data needs to be confirmed and checked.

### Citation Indexes

At the moment, we only are using one citation index:

* CrossRef

More will be added in the future!

### Translations
The app supports translations, but only English is available for now.

To add a new language, go to `./src/i18n` and drop in the relevant `{language}.json` file.

---

## TEAM

Members:

* Bronwyn King (UNSW)
* Daniel Henderson (UTS)
* Hugh Rundle (La Trobe)

---

## Setting up the environment

Follow the instructions [here](https://developers.exlibrisgroup.com/cloudapps/started/) to begin initial setup.

Once the `eca` command-line tool is installed and ready to go, check out the repository.

Either you can do `eca init` to generate your custom `config.json` with institution-specific data, or you can rename `config.json.dist` in the root directory to `config.json`, taking care to insert your institution code as required.

Once done, you can then start the application with the following command: `eca start`.
