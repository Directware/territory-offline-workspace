import { Inject, Injectable } from "@angular/core";
import {DOCUMENT} from "@angular/common";
import {environment} from "../../../environments/environment";
declare const window: any;
declare const dataLayer: any;

@Injectable()
export class GoogleAnalyticsService
{
    constructor(@Inject(DOCUMENT) private doc) { }

    public initOnlyInProd()
    {
        if (environment.production)
        {
            const script = this.doc.createElement("script");
            script.src = 'https://www.googletagmanager.com/gtag/js?id=UA-137522151-1';
            script.type = 'text/javascript';
            script.async = true;
            script.charset = 'utf-8';
            this.doc.head.appendChild(script);
            setTimeout(() => this.gtag(), 1000);
        }
    }

    private gtag()
    {
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        //@ts-ignore
        gtag('js', new Date());
        //@ts-ignore
        gtag('config', 'UA-137522151-1');
    }
}
