import { Component, Inject } from '@angular/core';
import { AddButtonComponent } from "../../layout/buttons/add-button/add-button.component";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TableColumn, MainTableComponent } from '../../layout/tables/main-table/main-table.component';
import { StudyProgramsCellComponent } from '../../layout/cells/study-programs-cell/study-programs-cell.component';
import { ActionsCellComponent } from '../../layout/cells/actions-cell/actions-cell.component';
import { StudyProgramService } from '../../services/study-program.service';
import { DOCUMENT, NgFor, NgIf } from '@angular/common';
import { BaseComponent } from '../base-template/base-template.component';
import { DocumentService } from '../../services/document.service';
import { DocumentModel } from '../../data/model/document.model';
import { DocumentDialogComponent } from '../../layout/dialogs/document-dialog/document-dialog.component';
import { Observable } from 'rxjs';
import { DocumentRequestDTO } from '../../data/dto/document-request.dto';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SidebarFilterComponent } from "../../layout/sidebars/sidebar-filter/sidebar-filter.component";
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { CustomPaginatorIntl } from '../../layout/paginator/custom-paginator-intl.service';
import { SearchInputComponent } from '../../layout/inputs/search-input/search-input.component';
import { LoadingContainerComponent } from '../../layout/containers/loading-container/loading-container.component';

@Component({
  selector: 'app-documents',
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
export class DocumentsComponent extends BaseComponent<DocumentModel> {
  override items: DocumentModel[] = [];
  override headerText: string = "Dokumente";
  override addButtonText: string = "Dokument hinzufügen";

  constructor(
    protected override dialog: MatDialog,
    protected override studyProgramService: StudyProgramService,
    protected override snackBar: MatSnackBar,
    @Inject(DOCUMENT) protected override document: Document,
    private documentService: DocumentService
  ) {
    super(dialog, studyProgramService, snackBar, document);
  }

  columns: TableColumn<DocumentModel>[] = [
    {
      key: 'title',
      header: 'Titel',
      value: (document: DocumentModel) => document.title,
      primary: true,
    },
    {
      key: 'uploaded',
      header: 'Hinzugefügt am',
      value: (document: DocumentModel) => document.uploaded.toLocaleDateString(),
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
    this.documentService.getAllDocuments().subscribe({
      next: (documents: DocumentModel[]) => {
        this.items = documents;
        this.displayedItems = [...documents];
        this.loading = false;
      },
      error: (error: any) => {
        this.handleError("Fehler beim Laden der Websites. Bitte laden Sie die Seite erneut.")
        this.loading = false;
      }
    });
  }

  override getDialogConfig(item?: DocumentModel | undefined): { data: any; component: any; } {
    return {
      data: {
        ...item,
        availableStudyPrograms: this.availableStudyPrograms,
        studyPrograms: item?.studyPrograms || [],
      },
      component: DocumentDialogComponent
    }
  }
  override getDeleteDialogText(item: DocumentModel): { title: string; message: string; } {
    return {
      title: 'Dokument löschen',
      message: `Sind Sie sicher, dass Sie das Dokument mit dem Titel "${item.title}" aus der Wissensbasis löschen wollen?`
    }
  }

  override deleteData(id: string): Observable<void> {
    return this.documentService.deleteDocument(id);
  }

  onView(rowData: DocumentModel) {
    this.documentService.getDocumentById(rowData.id).subscribe({
      next: (pdfBlob) => {
        const url = URL.createObjectURL(pdfBlob);
        window.open(url, '_blank');
  
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      },
      error: (error) => {
        this.handleError("Dokument konnte nicht geladen werden.")
      }
    });
  }

  onEdit(doc: DocumentModel): void {
    this.openAddOrEditDialog(doc);
  }

  override editItem(item: DocumentModel): Observable<DocumentModel> {
    return this.documentService.editDocument(item.id, this.createDTO(item));
  }

  private createDTO(data: DocumentModel): DocumentRequestDTO {
    const dto: DocumentRequestDTO = {
      title: data.title,
      studyProgramIds: data.studyPrograms.map(sp => sp.id),
    };
    return dto;
  }

  protected matchSearch(item: DocumentModel, searchTerm: string): boolean {
    if (! searchTerm || searchTerm == "") {
      return true;
    }
    const lowerTerm = searchTerm.toLowerCase();
    return item.title.toLowerCase().includes(lowerTerm);
  }
}
