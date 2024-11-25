import { Component, Inject } from '@angular/core';
import { StudyProgramFilterButtonComponent } from "../../layout/buttons/study-program-filter/study-program-filter-button.component";
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

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [
    StudyProgramFilterButtonComponent,
    AddButtonComponent,
    MatDialogModule,
    MainTableComponent,
    NgIf,
    NgFor
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
    @Inject(DOCUMENT) protected override document: Document,
    private documentService: DocumentService
  ) {
    super(dialog, studyProgramService, document);
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
    this.documentService.getAllDocuments("OrgID").subscribe(
      (docs) => {
        this.items = docs;  
        this.displayedItems = [...docs];
      },
      (error) => {
        // TODO: Handle error
        console.error('Error fetching documents:', error);
      }
    );
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

  onView(rowData: DocumentModel) {
    this.documentService.getDocumentById(rowData.id).subscribe(
      (pdfBlob) => {
        const url = URL.createObjectURL(pdfBlob);
        window.open(url, '_blank');
  
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      },
      (error) => {
        // TODO: Error handling
        console.error('Error fetching document:', error);
      }
    );
  }

  onEdit(doc: DocumentModel): void {
    this.openAddOrEditDialog(doc);
  }
}
