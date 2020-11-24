import {GoogleAnalyticsService} from './core/services/google-analytics.service';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule} from '@angular/forms';
import {ScrollToModule} from '@nicky-lenaers/ngx-scroll-to';
import {NavigationComponent} from './core/components/navigation/navigation.component';
import {FooterComponent} from './core/components/footer/footer.component';
import {NavigationTriggerComponent} from './core/components/navigation/navigation-trigger/navigation-trigger.component';
import { IconsModule } from './core/icons/icons.module';
import { AppRoutingModule } from './app-routing.module';
import { HomeModule } from './home/home.module';
import { DownloadWrapperComponent } from './core/components/download-wrapper/download-wrapper.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent, NavigationComponent, FooterComponent, NavigationTriggerComponent, DownloadWrapperComponent],
  imports: [
    HomeModule,
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ScrollToModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    IconsModule
  ],
  providers: [GoogleAnalyticsService],
  bootstrap: [AppComponent]
})
export class AppModule {}
