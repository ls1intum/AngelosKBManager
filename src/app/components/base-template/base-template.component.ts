import { Component, Directive, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { BaseItem } from '../../data/model/base-item.model';
import { StudyProgram } from '../../data/model/study-program.model';
import { MatDialog } from '@angular/material/dialog';
import { StudyProgramService } from '../../services/study-program.service';
import { DOCUMENT } from '@angular/common';
import { ConfirmDialogComponent } from '../../layout/dialogs/confirm-dialog/confirm-dialog.component';
import { SidebarFilterComponent } from '../../layout/sidebars/sidebar-filter/sidebar-filter.component';
import { TableColumn } from '../../layout/tables/main-table/main-table.component';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from '../../services/authentication.service';

@Directive()
export abstract class BaseComponent<T extends BaseItem> implements OnInit {
  displayedItems: T[] = [];
  selectedProgram: StudyProgram | null = null;
  availableStudyPrograms: StudyProgram[] = [];
  filterOptions: StudyProgram[] = [];

  // Common menu variables
  selectedItem: T | null = null;
  studyProgramsToAdd: StudyProgram[] = [];
  currentMenuButton: HTMLElement | null = null;
  documentHeight = 0;
  menuOpen = false;
  menuPosition = { top: 0, left: 0, openUpwards: false };

  searchTerm: string = '';
  loading: boolean = true;

  protected abstract matchSearch(item: T, searchTerm: string): boolean;

  @ViewChild('containerRef', { static: true }) containerRef!: ElementRef;

  // Abstract properties/methods to be implemented by child components
  abstract items: T[];
  abstract columns: TableColumn<T>[];

  abstract headerText: string;
  abstract addButtonText: string;

  abstract fetchData(): void;
  abstract deleteData(id: string): Observable<void>;
  abstract editItem(item: T): Observable<T>

  abstract getDialogConfig(item?: T): { data: any; component: any };
  abstract getDeleteDialogText(item: T): { title: string; message: string };

  constructor(
    protected dialog: MatDialog,
    protected studyProgramService: StudyProgramService,
    protected snackBar: MatSnackBar,
    @Inject(DOCUMENT) protected document: Document,
  ) { }

  ngOnInit(): void {
    if (this.document) {
      this.documentHeight = this.document.documentElement.scrollHeight;
    }
    this.studyProgramService.fetchStudyPrograms().subscribe({
      next: (programs) => {
        this.availableStudyPrograms = programs;
        const general: StudyProgram = {
          id: -1,
          name: 'Allgemein',
        };
        this.filterOptions = [general, ...this.availableStudyPrograms];

        // Fetch component-specific data after study programs are loaded
        this.loading = true;
        this.fetchData();
      },
      error: (err) => {
        console.error('Error fetching study programs:', err);
      },
    });
  }

  onProgramSelected(program: StudyProgram | null): void {
    // Remove search term
    this.searchTerm = "";
    // If we choose the same program again, we unselect
    if (this.selectedProgram && program && this.selectedProgram.id == program.id) {
      this.selectedProgram = null;
      this.displayedItems = [...this.items];
      return;
    }
    // Else we either remove the filter, filter for "Allgemein" or the specific study program
    this.selectedProgram = program;
    if (program) {
      if (program.id !== -1) {
        this.displayedItems = this.items.filter((item) =>
          item.studyPrograms.some((sp) => sp.id === program.id)
        );
      } else {
        this.displayedItems = this.items.filter(
          (item) => item.studyPrograms.length === 0
        );
      }
    } else {
      this.displayedItems = [...this.items];
    }
  }

  openAddOrEditDialog(item?: T): void {
    const { component, data } = this.getDialogConfig(item);

    const dialogRef = this.dialog.open(component, { data });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== null && result !== undefined) {
        if (item) {
          this.handleSuccess("Bearbeiten erfolgreich.")
          Object.assign(item, result);
        } else {
          this.handleSuccess("Hinzufügen zur Knowledge Base erfolgreich.")
          const newItem: T = result;
          this.items = [newItem, ...this.items];
          this.displayedItems = [newItem, ...this.displayedItems];
        }
      } else if (result === null) {
        this.handleError("Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.")
      }
    });
  }

  onDelete(item: T): void {
    const { title, message } = this.getDeleteDialogText(item);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title, message },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.deleteData(item.id).subscribe({
          next: () => {
            // Successful deletion: update the state
            this.handleSuccess("Löschen erfolgreich.")
            this.items = this.items.filter((i) => i.id !== item.id);
            this.displayedItems = this.displayedItems.filter((i) => i.id !== item.id);
          },
          error: (error) => {
            console.error('Delete failed:', error);
            this.handleError("Löschen nicht möglich. Bitte versuchen Sie es noch einmal.");
          }
        });
      }
    });
  }

  onAddStudyProgram(rowData: T, button: HTMLElement) {
    const buttonPosition = button.getBoundingClientRect();
    const middleY = window.innerHeight / 2;

    if (this.menuOpen && this.currentMenuButton?.id === button.id) {
      this.closeMenu();
      return;
    }

    this.selectedItem = rowData;

    const containerRect = this.containerRef.nativeElement.getBoundingClientRect();

    // Calculate offsets relative to container
    const offsetTop = buttonPosition.bottom - containerRect.top;
    const offsetLeft = buttonPosition.left - containerRect.left;

    this.menuPosition = {
      top: offsetTop,
      left: offsetLeft,
      openUpwards: buttonPosition.bottom > middleY,
    };
    this.currentMenuButton = button;

    const assignedIds = rowData.studyPrograms
      ? rowData.studyPrograms.map((sp: StudyProgram) => sp.id)
      : [];

    this.studyProgramsToAdd = this.availableStudyPrograms.filter(
      (sp) => !assignedIds.includes(sp.id)
    );

    this.menuOpen = true;
    setTimeout(() => {
      document.addEventListener('click', this.onDocumentClick);
    });
  }

  addStudyProgram(program: StudyProgram) {
    // Add the study program to the items's studyPrograms array
    if (this.selectedItem) {
      // Deep copy of item
      const selectedItemCopy: T = {
        ...this.selectedItem,
        studyPrograms: [...this.selectedItem.studyPrograms]
      };
      selectedItemCopy.studyPrograms.push(program);

      this.editItem(selectedItemCopy).subscribe({
        next: (value) => {
          this.selectedItem = value;
          this.displayedItems = this.displayedItems.map((item) =>
            item.id === value.id ? value : item
          );

          this.items = this.items.map((item) =>
            item.id === value.id ? value : item
          );
        },
        error: (error) => {
          console.error('Study program edit failed:', error);
          this.handleError("Bearbeiten der Studiengänge nicht möglich. Bitte versuchen Sie es später erneut.");
        }
      });
    }
    this.menuOpen = false;

  }

  onRemoveStudyProgram(item: T, program: StudyProgram) {
    const updatedItem: T = {
      ...item,
      studyPrograms: item.studyPrograms.filter((sp) => sp.id !== program.id),
    };

    // Call the backend edit function
    this.editItem(updatedItem).subscribe({
      next: (value) => {
        Object.assign(item, value);
      },
      error: (error) => {
        console.error('Study program removal failed:', error);
        this.handleError(
          'Entfernen des Studiengangs nicht möglich. Bitte versuchen Sie es später erneut.'
        );
      },
    });
  }

  onDocumentClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.closest('.study-program-add-button') && target !== this.currentMenuButton) {
      return;
    }
    if (!target.closest('.study-program-menu') && !target.closest('.menu-button')) {
      this.closeMenu();
    }
  }

  closeMenu() {
    this.menuOpen = false;
    this.menuPosition = { top: 0, left: 0, openUpwards: false };
    this.currentMenuButton = null;
    document.removeEventListener('click', this.onDocumentClick);
  }

  handleError(errorMessage: string) {
    this.snackBar.open(errorMessage, 'Schließen', {
      duration: 5000, // Show the snackbar for 5 seconds
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['error-snack-bar']
    });
  }

  handleSuccess(successMessage: string): void {
    this.snackBar.open(successMessage, 'Schließen', {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['success-snack-bar'],
    });
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.applyCombinedFilters();
  }

  getAvailableStudyPrograms(): number {
    return this.availableStudyPrograms.length;
  }

  private applyCombinedFilters(): void {
    // Start with all items
    let filtered = [...this.items];

    // Filter by selected program, if any
    if (this.selectedProgram) {
      if (this.selectedProgram.id !== -1) {
        filtered = filtered.filter((item) =>
          item.studyPrograms.some((sp) => sp.id === this.selectedProgram!.id)
        );
      } else {
        // "Allgemein"
        filtered = filtered.filter((item) => item.studyPrograms.length === 0);
      }
    }

    // Then filter by search term, if not empty
    if (this.searchTerm.trim()) {
      filtered = filtered.filter((item) =>
        this.matchSearch(item, this.searchTerm.trim())
      );
    }

    this.displayedItems = filtered;
  }
}