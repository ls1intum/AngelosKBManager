import { Component, Inject } from '@angular/core';
import { StudyProgram } from '../../data/model/study-program.model';
import { StudyProgramFilterButtonComponent } from '../../layout/buttons/study-program-filter/study-program-filter-button.component';
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

@Component({
  selector: 'app-websites',
  standalone: true,
  imports: [
    StudyProgramFilterButtonComponent,
    AddButtonComponent,
    MatDialogModule,
    MainTableComponent,
    NgIf,
    NgFor,
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
    @Inject(DOCUMENT) protected override document: Document,
    private websiteService: WebsiteService
  ) {
    super(dialog, studyProgramService, document);
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
    this.websiteService.getAllWebsites("OrgID").subscribe(
      (websites) => {
        this.items = websites;  
        this.displayedItems = [...websites];
      },
      (error) => {
        // TODO: Handle error
        console.error('Error fetching websites:', error);
      }
    );
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

  onRefresh(website: Website) {
    // TODO: Implement web scraping specific website via API request
    console.log("Refreshing...", website);
  }
}
