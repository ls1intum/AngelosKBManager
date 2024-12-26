import { Component, Inject, OnInit } from '@angular/core';
import { BaseDialogDirective } from '../base-dialog.directive';
import { DocumentModel } from '../../../data/model/document.model';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { DOCUMENT, NgFor, NgIf } from '@angular/common';
import { DocumentService } from '../../../services/document.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DocumentRequestDTO } from '../../../data/dto/document-request.dto';
import { Observable } from 'rxjs';
import { LoadingContainerComponent } from '../../containers/loading-container/loading-container.component';


@Component({
  selector: 'app-document-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    NgIf,
    NgFor,
    MatProgressSpinnerModule,
    LoadingContainerComponent
  ],
  templateUrl: './document-dialog.component.html',
  styleUrls: ['./document-dialog.component.css', '../dialog-styles.css', '../../cells/study-programs-cell/study-programs-cell.component.css']
})
export class DocumentDialogComponent extends BaseDialogDirective<DocumentModel> implements OnInit {
  selectedFile: File | null = null;
  selectedFileName: string | null = null;
  private blobUrl: string | null = null;
  pdfSrc: SafeResourceUrl | null = null;
  isLoading: boolean = false;

  constructor(
    public override dialogRef: MatDialogRef<
      BaseDialogDirective<DocumentModel>
    >,
    @Inject(MAT_DIALOG_DATA) public override data: any,
    @Inject(DOCUMENT) protected override document: Document,
    private documentService: DocumentService,
    private sanitizer: DomSanitizer,
  ) {
    super(dialogRef, data, document);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    if (this.editMode && this.data.id) {
      this.fetchExistingPdf();
    }
  }

  fetchExistingPdf(): void {
    this.isLoading = true;
    this.documentService.getDocumentById(this.data.id).subscribe(
      (pdfBlob) => {
        const fileURL = URL.createObjectURL(pdfBlob);
        this.blobUrl = URL.createObjectURL(pdfBlob);
        this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching document:', error);
        this.isLoading = false;
      }
    );
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (file.type !== 'application/pdf') {
        alert('Bitte wählen Sie eine PDF-Datei aus.');
        return;
      }

      this.selectedFile = file;
      this.selectedFileName = file.name;

      // Create a local URL to display the PDF
      const fileURL = URL.createObjectURL(file);
      this.blobUrl = fileURL;
      this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

      // If there was an existing file, mark it for deletion
      if (this.editMode && this.data.id && this.data.fileId) {
        this.data.deleteExistingFile = true;
      }
    }
  }

  discardPdf(): void {
    // Revoke the object URL to free up memory
    if (this.blobUrl) {
      URL.revokeObjectURL(this.blobUrl);
    }
    this.blobUrl = null;
    this.pdfSrc = null;
    this.selectedFile = null;
    this.selectedFileName = null;
  
    // If in edit mode, mark existing file for deletion
    if (this.editMode && this.data.id && !this.selectedFile) {
      this.data.deleteExistingFile = true;
    }
  }

  protected override makeAddRequest(data: DocumentModel): Observable<DocumentModel> {
    const documentRequestDTO = this.createDTO(data);
    if (!this.selectedFile) {
      // TODO: This can never happen but still handle error
      throw new Error('No file selected for upload.');
    }

    return this.documentService.addDocument(documentRequestDTO, this.selectedFile);
  }

  protected override makeEditRequest(data: DocumentModel): Observable<DocumentModel> {
    const documentRequestDTO = this.createDTO(data);
    
    return this.documentService.editDocument(data.id, documentRequestDTO);
  }

  private createDTO(data: DocumentModel): DocumentRequestDTO {
    const dto: DocumentRequestDTO = {
      title: data.title,
      studyProgramIds: data.studyPrograms.map(sp => sp.id),
    };
    return dto;
  }

  override get canSave(): boolean {
    // Disable confirm button if title is empty or no PDF is selected
    return !!this.data.title?.trim() && !!this.pdfSrc && !this.isLoading;
  }
}
