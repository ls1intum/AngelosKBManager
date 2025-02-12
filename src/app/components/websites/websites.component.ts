import { Component, Inject } from '@angular/core';
import { AddButtonComponent } from "../../layout/buttons/add-button/add-button.component";
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { TableColumn, MainTableComponent } from '../../layout/tables/main-table/main-table.component';
import { Website } from '../../data/model/website.model';
import { LinkCellComponent } from '../../layout/cells/link-cell/link-cell.component';
import { StudyProgramsCellComponent } from '../../layout/cells/study-programs-cell/study-programs-cell.component';
import { ActionsCellComponent } from '../../layout/cells/actions-cell/actions-cell.component';
import { RefreshCellComponent } from '../../layout/cells/refresh-cell/refresh-cell.component';
import { StudyProgramService } from '../../services/study-program.service';
import { BaseComponent } from '../base-template/base-template.component';
import { DOCUMENT, NgFor, NgIf } from '@angular/common';
import { WebsiteService } from '../../services/website.service';
import { WebsiteDialogComponent } from '../../layout/dialogs/website-dialog/website-dialog.component';
import { Observable } from 'rxjs';
import { WebsiteRequestDTO } from '../../data/dto/website-request.dto';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SidebarFilterComponent } from '../../layout/sidebars/sidebar-filter/sidebar-filter.component';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { CustomPaginatorIntl } from '../../layout/paginator/custom-paginator-intl.service';
import { SearchInputComponent } from '../../layout/inputs/search-input/search-input.component';
import { LoadingContainerComponent } from '../../layout/containers/loading-container/loading-container.component';

@Component({
  selector: 'app-websites',
  standalone: true,
  imports: [
    SidebarFilterComponent,
    AddButtonComponent,
    MatDialogModule,
    MainTableComponent,
    NgIf,
    NgFor,
    MatSnackBarModule,
    MatPaginatorModule,
    SearchInputComponent,
    LoadingContainerComponent
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }
  ],
  templateUrl: '../base-template/base-template.component.html',
  styleUrl: '../base-template/base-template.component.css'
})
export class WebsitesComponent extends BaseComponent<Website> {
  override headerText: string = "Websites"
  override addButtonText: string = "Website hinzufügen"
  override items: Website[] = [];

  constructor(
    protected override dialog: MatDialog,
    protected override studyProgramService: StudyProgramService,
    protected override snackBar: MatSnackBar,
    @Inject(DOCUMENT) protected override document: Document,
    private websiteService: WebsiteService,
  ) {
    super(dialog, studyProgramService, snackBar, document);
  }

  columns: TableColumn<Website>[] = [
    {
      key: 'title',
      header: 'Titel',
      value: (website: Website) => website.title,
      primary: true,
    },
    {
      key: 'link',
      header: 'Link',
      cellComponent: LinkCellComponent,
    },
    {
      key: 'lastUpdated',
      header: 'Zuletzt aktualisiert',
      cellComponent: RefreshCellComponent,
    },
    {
      key: 'studyPrograms',
      header: 'Studiengänge',
      cellComponent: StudyProgramsCellComponent,
    },
    {
      key: 'actions',
      header: '',
      cellComponent: ActionsCellComponent,
    },
  ];

  override fetchData(): void {  
    this.websiteService.getAllWebsites().subscribe({
      next: (websites) => {
        this.items = websites;
        this.displayedItems = [...websites];
        this.loading = false;
      },
      error: (error) => {
        this.handleError("Fehler beim Laden der Websites. Bitte laden Sie die Seite erneut.");
        this.loading = false;
      }
    });
  }

  override deleteData(id: string): Observable<void> {
    return this.websiteService.deleteWebsite(id);
  }

  override getDialogConfig(item?: Website | undefined): { data: any; component: any; } {
    return {
      data: {
        ...item,
        availableStudyPrograms: this.availableStudyPrograms,
        studyPrograms: item?.studyPrograms || [],
      },
      component: WebsiteDialogComponent
    }
  }

  override getDeleteDialogText(item: Website): { title: string; message: string; } {
    return {
      title: 'Website löschen',
      message: `Sind Sie sicher, dass Sie die Website mit dem Titel "${item.title}" aus der Wissensbasis löschen wollen?`
    }
  }

  override editItem(data: Website): Observable<Website> {
    return this.websiteService.editWebsite(data.id, this.createRequest(data));
  }

  onRefresh(website: Website) {
    this.websiteService.editWebsite(website.id, this.createRequest(website)).subscribe({
      next: (value: Website) => { 
        Object.assign(website, value);
        this.handleSuccess("Der Inhalt der Website wurde erfolgreich aktualisiert.")
      },
      error: (error) => { this.handleError("Website konnte nicht aktualisiert werden. Bitte versuchen Sie es zu einem späteren Zeitpunkt erneut.") }
    });
  }

  private createRequest(data: Website): WebsiteRequestDTO {
    const request: WebsiteRequestDTO = {
      title: data.title,
      link: data.link,
      studyProgramIds: data.studyPrograms.map(s => s.id)
    };
    return request;
  }

  protected matchSearch(item: Website, searchTerm: string): boolean {
    if (! searchTerm || searchTerm == "") {
      return true;
    }
    const lowerTerm = searchTerm.toLowerCase();
    return (
      item.title.toLowerCase().includes(lowerTerm) ||
      item.link.toLowerCase().includes(lowerTerm)
    );
  }
}
