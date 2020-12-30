// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
// eslint-disable-next-line @typescript-eslint/no-namespace
import {BulkImportTags, UpsertTag} from "../../../territory-offline/src/app/core/store/tags/tags.actions";
import {TagSymbol} from "@territory-offline-workspace/api";
import {uuid4} from "@capacitor/core/dist/esm/util";
import {UnlockApp, UpsertSettings} from "../../../territory-offline/src/app/core/store/settings/settings.actions";
import {
  UpsertCongregation,
  UseCongregation
} from "../../../territory-offline/src/app/core/store/congregation/congregations.actions";
import {BulkImportPublishers} from "../../../territory-offline/src/app/core/store/publishers/publishers.actions";

declare namespace Cypress
{
  interface Chainable<Subject>
  {
    createTags(tagName: string): void;

    configureApp(): void;

    navigate(): void;
  }
}
//
// -- This is a parent command --
Cypress.Commands.add('createTags', (tagName: []) =>
{
  cy.window()
    .then(w =>
    {
      const tags = tagName.map(name => ({
        id: uuid4(),
        creationTime: new Date(),
        name: name,
        symbol: TagSymbol.TRIANGLE,
        color: '#000'
      }))

      w["store"].dispatch(BulkImportTags({tags}));
    });
});

Cypress.Commands.add('createPublishers', (publishers: any[]) =>
{
  cy.window()
    .then(w =>
    {
      const p = publishers.map(publisher => ({...publisher, id: uuid4(), creationTime: new Date()}));
      w["store"].dispatch(BulkImportPublishers({publishers: p}));
    });
});

Cypress.Commands.add('navigate', (location) =>
{
  cy.window().then(w => w["angularRouting"](location));
});

Cypress.Commands.add('configureApp', () =>
{
  const settings = {
    appLanguage: {languageCode: "de", nativeName: "Deutsch", name: "German"},
    autoAppLockingInMinutes: 0,
    currentCongregationId: "5b1fa219-d56c-44e1-a556-e85add53fcb1",
    id: "6330e826-7c6b-4683-8cc0-993e20cd5dfd",
    encryptedSecretKey: "gHggy7IA72PlUgPFMNDp+4hshaup+UhGQxWcT0pT2+zeAwwcq6aNIM0OSwEtNjxyqOR6jSA7DmtkEeKKcHaLlay8G6o98Idh3UFEQthdd2xXcjZ2zCr6P4QIYCg4D0reQhnUFA2BZj7ct96cuFYGf78v1NnGKcn3Fzffu4aqyrYTD+rXfgh+njSGiukpQjcIv3xtGbcr7Yh/lrzhYZJYZHFhA1RXjNL6ERTwqkAFMe8+kE1J32jd24qG8v2RwFyF/pU0e4zgRG0z1g9DZ58Ta7nl17wyC75T0GKLZkXJQrgBBBFCcXmEWpNV5kTJTawXmR5jegmgMGUu5OlBYspgvgZSGVyS6+BLkIu+aStSwLYSBhEx5bBntNyh5exmADdg+itzyBvNYWHYFevmALq2HtejoOLyp0PZ",
    initialConfigurationDone: true,
    isAppLocked: true,
    overdueBreakInMonths: 8,
    // pw: test12345
    passwordHash: "liwmju5xwBcudDWizlP2WOkdv5YptVSMU5801wPNHFtyX0FOgyFSdbA+XRpEsKQum0SCNnejX09INoZaR9Ie9g==",
    processingBreakInMonths: 4,
    processingPeriodInMonths: 4,
    publicKey: new Uint8Array([212, 89, 113, 202, 106, 187, 14, 157, 177, 141, 109, 212, 102, 145, 143, 57, 121, 21, 224, 215, 106, 12, 106, 206, 213, 189, 137, 64, 78, 184, 128, 114]),
    releaseInfo: null,
    secretKey: new Uint8Array([232, 170, 162, 176, 27, 249, 201, 36, 31, 250, 104, 134, 27, 253, 120, 26, 179, 147, 195, 111, 58, 109, 171, 195, 29, 235, 238, 169, 181, 110, 240, 246]),
    territoryOrigin: {lng: 10.8606, lat: 48.35534}
  };

  const congregation = {
    id: "5b1fa219-d56c-44e1-a556-e85add53fcb1",
    name: "Cypress West",
    language: settings.appLanguage.nativeName,
    languageCode: settings.appLanguage.languageCode,
    hashedName: btoa("Cypress West"),
    creationTime: new Date()
  };

  /* Reihenfolge relevant! */
  cy.window().then(w => w["store"].dispatch(UpsertSettings({settings})));
  cy.wait(300);
  cy.window().then(w => w["store"].dispatch(UpsertCongregation({congregation})));
  cy.wait(1);
  cy.window().then(w => w["store"].dispatch(UseCongregation({congregationId: congregation.id})));
  cy.wait(1);
  cy.window().then(w => w["store"].dispatch(UnlockApp()));
  cy.wait(1);
});
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
