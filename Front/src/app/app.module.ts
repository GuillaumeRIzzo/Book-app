import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatMenu, MatMenuModule } from '@angular/material/menu'; 
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper'; 
import { OverlayModule } from '@angular/cdk/overlay'
import { MatDivider } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatGridListModule } from '@angular/material/grid-list';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { UserModule } from './user/user.module';
import { BookModule } from './book/book.module';
import { AuthorModule } from './author/author.module';
import { NavabarComponent } from './navabar/navabar.component';
import { PublisherModule } from './publisher/publisher.module';
import { BookCategoryModule } from './book-category/book-category.module';
import { DialogComponent } from './dialog/dialog.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { SearchComponent } from './search/search.component';
import { SearchOverlayComponent } from './search/searchOverlay/searchOverlay.component';
import { QuickResultsListComponent } from './search/quickResultsList/quickResultsList.component';
import { TruncatePipe } from './truncate.pipe';
import { SearchResultsComponent } from './search/searchResults/searchResults.component';

@NgModule({
    declarations: [
        AppComponent,
        NavabarComponent,
        DialogComponent,
        SearchComponent,
        SearchOverlayComponent,
        QuickResultsListComponent,
        SearchResultsComponent,
        TruncatePipe
    ],
    providers: [
        provideAnimationsAsync()
    ],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatSidenavModule,
        MatDivider,
        MatSidenav,
        MatListModule,
        MatTableModule,
        MatCardModule,
        MatGridListModule,
        MatMenu,
        MatButtonModule,
        MatMenuModule,
        MatIconModule,
        MatDialogModule,
        MatStepperModule,
        UserModule,
        BookModule, 
        BookCategoryModule,
        AuthorModule,
        PublisherModule,
        AppRoutingModule,
        OverlayModule,
    ]
})
export class AppModule { }
