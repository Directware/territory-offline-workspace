import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GoogleAnalyticsService } from './core/services/google-analytics.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent
{
    constructor(translate: TranslateService, googleAnalyticsService: GoogleAnalyticsService) 
    {
        googleAnalyticsService.initOnlyInProd();
        translate.setDefaultLang('en');

        if (translate.getBrowserLang() !== undefined)
        {
            translate.use(translate.getBrowserLang());
        }
        else
        {
            translate.use('en');
        }
    }
}
