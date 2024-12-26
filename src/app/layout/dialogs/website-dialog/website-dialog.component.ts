import { DOCUMENT, NgFor, NgIf } from '@angular/common';
import { Component, inject, Inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { StudyProgram } from '../../../data/model/study-program.model';
import { BaseDialogDirective } from '../base-dialog.directive';
import { Website } from '../../../data/model/website.model';
import { WebsiteService } from '../../../services/website.service';
import { Observable } from 'rxjs';
import { WebsiteRequestDTO } from '../../../data/dto/website-request.dto';
import { LoadingContainerComponent } from "../../containers/loading-container/loading-container.component";

@Component({
  selector: 'app-website-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    NgIf,
    NgFor,
    LoadingContainerComponent
],
  templateUrl: './website-dialog.component.html',
  styleUrls: ['./website-dialog.component.css', '../dialog-styles.css', '../../cells/study-programs-cell/study-programs-cell.component.css']
})
export class WebsiteDialogComponent extends BaseDialogDirective<Website> {
  
  private websiteService = inject(WebsiteService);

  override get canSave(): boolean {
    return (
      this.data.title?.trim() &&
      this.data.link?.trim()
    );
  }

  protected override makeAddRequest(data: Website): Observable<Website> {
    return this.websiteService.addWebsite(this.createRequest(data));
  }

  protected override makeEditRequest(data: Website): Observable<Website> {
    return this.websiteService.editWebsite(data.id, this.createRequest(data));
  }

  private createRequest(data: Website): WebsiteRequestDTO {
    const request: WebsiteRequestDTO = {
      title: data.title,
      link: data.link,
      studyProgramIds: data.studyPrograms.map(s => s.id)
    };
    return request;
  }
}
