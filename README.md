This is a Cloud App for [Ex Libris](https://github.com/ExLibrisGroup) Alma library software. This is also very much a work in progress!

---

## PURPOSE

This Cloud App looks up titles in citation indexes such as [CrossRef](https://www.crossref.org/) when citations data is reported as bad, or Alma cannot find it in its repository/openURL.

### Use cases

* Patrons may have submitted bad citation data for requesting resources via Rapid ILL
* Sometimes citation data needs to be confirmed and checked
* Prefilling ILL request forms, given a DOI URL.

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
