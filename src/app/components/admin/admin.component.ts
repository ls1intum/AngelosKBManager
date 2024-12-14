import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DOCUMENT, NgFor, NgIf } from '@angular/common';
import { UserService } from '../../services/user.service';
import { StudyProgramService } from '../../services/study-program.service';
import { UserDTO } from '../../data/dto/user.dto';
import { User } from '../../data/model/user.model'; // create this file as shown above
import { StudyProgram } from '../../data/model/study-program.model';
import { TableColumn, MainTableComponent } from '../../layout/tables/main-table/main-table.component';
import { ActionsCellComponent } from '../../layout/cells/actions-cell/actions-cell.component';
import { ConfirmDialogComponent } from '../../layout/dialogs/confirm-dialog/confirm-dialog.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    MatDialogModule,
    MainTableComponent,
    MatSnackBarModule
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {

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
    @Inject(DOCUMENT) protected document: Document
  ) {}

  ngOnInit(): void {
    // Fetch study programs
    this.studyProgramService.fetchStudyPrograms().subscribe({
      next: (programs) => {
        this.studyPrograms = programs;
        //this.displayedStudyPrograms = [...programs];
      },
      error: (err) => {
        this.handleError('Fehler beim Abrufen der Studiengänge. Bitte versuchen Sie es später erneut.');
        console.error('Error fetching study programs for Admin:', err);
      },
    });

    // Fetch users
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users
      },
      error: (err) => {
        this.handleError('Fehler beim Abrufen der Benutzerliste. Bitte versuchen Sie es später erneut.');
        console.error('Error fetching users for Admin:', err);
      }
    });
  }

  onApprove(user: User) {
    // Call a userService method to approve user
    console.log('Approving user', user);
    const title = "Bestätigen"
    // Resourcen verwalten
    const message = "Wollen Sie dieses Teammitglied bestätigen?"

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title, message },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.userService.setUserToAdmin(user.id).subscribe({
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
    console.log('Approving user', user);
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
    // ...
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
    });
  }

  private handleSuccess(successMessage: string): void {
    this.snackBar.open(successMessage, 'Schließen', {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['success-snackbar'],
    });
  }
}