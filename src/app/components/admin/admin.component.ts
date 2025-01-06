import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DOCUMENT, NgClass, NgFor, NgIf } from '@angular/common';
import { UserService } from '../../services/user.service';
import { StudyProgramService } from '../../services/study-program.service';
import { UserDTO } from '../../data/dto/user.dto';
import { User } from '../../data/model/user.model'; // create this file as shown above
import { StudyProgram } from '../../data/model/study-program.model';
import { TableColumn, MainTableComponent } from '../../layout/tables/main-table/main-table.component';
import { ActionsCellComponent } from '../../layout/cells/actions-cell/actions-cell.component';
import { ConfirmDialogComponent } from '../../layout/dialogs/confirm-dialog/confirm-dialog.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { concatMap } from 'rxjs';
import { AddButtonComponent } from "../../layout/buttons/add-button/add-button.component";
import { StudyProgramDialogComponent } from '../../layout/dialogs/study-program-dialog/study-program-dialog.component';
import { StudyProgramDTO } from '../../data/dto/study-program.dto';
import { MailService, MailStatus } from '../../services/mail.service';
import { MailDialogComponent } from '../../layout/dialogs/mail-dialog/mail-dialog.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    MatDialogModule,
    MainTableComponent,
    MatSnackBarModule,
    NgClass,
    AddButtonComponent
],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  public MailStatus = MailStatus;

  currentUser: UserDTO | null = null;

  mailStatus: MailStatus | null = null;
  mailCredentials: string | null = null;
  statusText: string = "";

  users: User[] = [];
  //displayedUsers: User[] = [];

  studyPrograms: StudyProgram[] = [];
  //displayedStudyPrograms: StudyProgram[] = [];

  // Define user columns
  userColumns: TableColumn<User>[] = [
    {
      key: 'mail',
      header: 'E-Mail',
      value: (user: User) => user.mail,
      primary: true
    },
    {
      key: 'actions',
      header: '',
      cellComponent: ActionsCellComponent,
    }
  ];

  // Define study program columns
  studyProgramColumns: TableColumn<StudyProgram>[] = [
    {
      key: 'name',
      header: 'Name',
      value: (sp: StudyProgram) => sp.name,
      primary: true
    },
  ];

  constructor(
    protected dialog: MatDialog,
    protected studyProgramService: StudyProgramService,
    protected userService: UserService,
    protected snackBar: MatSnackBar,
    protected mailService: MailService,
    @Inject(DOCUMENT) protected document: Document
  ) {}

  ngOnInit(): void {
    this.userService
      .getCurrentUser()
      .pipe(
        concatMap((userDTO) => {
          this.currentUser = userDTO;
          return this.studyProgramService.fetchStudyPrograms();
        }),
        concatMap((programs) => {
          this.studyPrograms = programs;
          console.log(this.currentUser);
          return this.userService.getAllUsers(this.currentUser ? this.currentUser.isAdmin : false);
        }),
        concatMap((users) => {
          this.users = users;
          return this.mailService.getMailCredentials();
        })
      )
      .subscribe({
        next: (mailCredentialsResponse) => {
          this.mailCredentials = mailCredentialsResponse.mailAccount;
          this.mailService.mailStatus$.subscribe((status) => {
            this.mailStatus = status;
            this.statusText = this.getStatusText(status);
          });
        },
        error: (err) => {
          console.error('Error in data fetching sequence:', err);
          this.handleError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
        },
      });
  }

  onApprove(user: User) {
    // Call a userService method to approve user
    const title = "Bestätigen"
    // Resourcen verwalten
    const message = "Wollen Sie dieses Teammitglied bestätigen?"

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title, message },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.userService.approveUser(user.id).subscribe({
          next: (updatedUser: User) => {
            this.updateUserInArray(updatedUser);
            this.handleSuccess('Das Teammitglied wurde erfolgreich bestätigt.');
          },
          error: (error) => {
            console.error("Error during approve user", error)
            this.handleError("Es ist ein Fehler aufgetreten. Der Benutzer konnte nicht als Teammitglied hinzugefügt werden. Bitte versuchen Sie es später erneut.")
          }
        });
      }
    });
    // ...
  }

  onSetAdmin(user: User) {
    const title = "Bestätigen"
    // Erklärung?
    const message = "Wollen Sie dieses Teammitglied zum Administrator für Ihre Organisation machen?"

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title, message },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.userService.setUserToAdmin(user.id).subscribe({
          next: (updatedUser: User) => {
            this.updateUserInArray(updatedUser);
            this.handleSuccess('Das Teammitglied wurde erfolgreich zum Administrator gemacht.');
          },
          error: (error) => {
            console.error("Error during set admin", error)
            this.handleError("Fehler beim Festlegen des Benutzers als Administrator. Bitte versuchen Sie es später erneut.");
          }
        });
      }
    });
  }

  addStudyProgram() {
    const dialogRef = this.dialog.open(StudyProgramDialogComponent, {
      data: { name: '' }
    });
  
    dialogRef.afterClosed().subscribe((result: StudyProgramDTO) => {
      if (result !== null && result !== undefined) {
        this.handleSuccess("Studiengang erfolgreich hinzugefügt.");
        // Refresh the list of study programs after adding
        this.studyProgramService.fetchStudyPrograms().subscribe({
          next: (programs) => {
            this.studyPrograms = (programs as StudyProgram[]).sort((a, b) => {
              const nameA = a.name.toLowerCase();
              const nameB = b.name.toLowerCase();
      
              if (nameA < nameB) return -1;
              if (nameA > nameB) return 1;
              return 0;
            });
          },
          error: (err) => {
            console.error("Error fetching study programs", err);
            this.handleError("Studiengänge konnten nicht neu geladen werden.");
          }
        });
      } else if (result === null) {
        this.handleError('Studiengang konnte nicht hinzugefügt werden.');
      }
    });
  }

  configureMail(): void {
    const dialogRef = this.dialog.open(MailDialogComponent, {
      data: {
        mailAccount: this.mailCredentials || '',
        password: '',
        confirmPassword: ''
      },
      width: '600px'
    });
  
    dialogRef.afterClosed().subscribe((result: boolean | null) => {
      if (result === true) {
        this.mailService.setMailStatus(MailStatus.ACTIVE);
        this.handleSuccess("E-Mail-Account erfolgreich konfiguriert.");
      } else if (result == false) {
        this.mailService.setMailStatus(MailStatus.INACTIVE);
        this.handleError("Fehler bei der Konfiguration des E-Mail-Accounts.");
      }
    });
  }

  private updateUserInArray(updatedUser: User): void {
    const index = this.users.findIndex(user => user.id === updatedUser.id);
    if (index !== -1) {
      this.users[index] = updatedUser;
    }
  }

  private handleError(errorMessage: string): void {
    this.snackBar.open(errorMessage, 'Schließen', {
      duration: 4000, 
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['error-snack-bar']
    });
  }

  private handleSuccess(successMessage: string): void {
    this.snackBar.open(successMessage, 'Schließen', {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['success-snack-bar'],
    });
  }

  private getStatusText(status: MailStatus | null): string {
    if (status === MailStatus.ACTIVE) {
        return "Der konfigurierte E-Mail-Account für die automatische Beantwortung von E-Mails ist aktiv.";
    } else if (status === MailStatus.INACTIVE) {
        return "Der konfigurierte E-Mail-Account ist inaktiv. Bitte geben Sie die Zugangsdaten erneut ein, um die Pipeline zu reaktivieren.";
    } else {
        return "Es ist ein Fehler beim Abrufen des E-Mail-Account-Status aufgetreten. Bitte versuchen Sie es später erneut oder geben Sie die Zugangsdaten erneut ein, um die Pipeline zu reaktivieren.";
    }
  }
}