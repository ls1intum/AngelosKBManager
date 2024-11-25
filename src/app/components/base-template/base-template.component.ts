import { Component, Directive, Inject, OnInit } from '@angular/core';
import { BaseItem } from '../../data/model/base-item.model';
import { StudyProgram } from '../../data/model/study-program.model';
import { MatDialog } from '@angular/material/dialog';
import { StudyProgramService } from '../../services/study-program.service';
import { DOCUMENT } from '@angular/common';
import { DeleteDialogComponent } from '../../layout/dialogs/delete-dialog/delete-dialog.component';
import { TableColumn } from '../../layout/tables/main-table/main-table.component';

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

  // Abstract properties/methods to be implemented by child components
  abstract items: T[];
  abstract columns: TableColumn<T>[];

  abstract headerText: string;
  abstract addButtonText: string;

  abstract fetchData(): void;
  abstract getDialogConfig(item?: T): { data: any; component: any };
  abstract getDeleteDialogText(item: T): { title: string; message: string };

  constructor(
    protected dialog: MatDialog,
    protected studyProgramService: StudyProgramService,
    @Inject(DOCUMENT) protected document: Document,
  ) {}

  ngOnInit(): void {
    if (this.document) {
      this.documentHeight = this.document.documentElement.scrollHeight;
    }
    this.studyProgramService.studyPrograms$.subscribe((programs) => {
      this.availableStudyPrograms = programs;
      const general: StudyProgram = {
        id: '-1',
        name: 'Allgemein'
      }
      this.filterOptions = [general, ...this.availableStudyPrograms]
    });
    this.fetchData();
  }

  onProgramSelected(program: StudyProgram | null): void {
    this.selectedProgram = program;
    if (program) {
      if (program.id !== '-1') {
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
      if (result) {
        if (item) {
          // TODO: Make API request to update existing item
          Object.assign(item, result);
        } else {
          // TODO: Make API request to add new item
          const newItem: T = { id: 'placeholder', ...result };
          this.items = [newItem, ...this.items];
          this.displayedItems = [newItem, ...this.displayedItems];
        }
      }
    });
  }

  onDelete(item: T): void {
    const { title, message } = this.getDeleteDialogText(item);

    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: { title, message },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.items = this.items.filter((i) => i.id !== item.id);
        this.displayedItems = this.displayedItems.filter((i) => i.id !== item.id);
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

    this.menuPosition = {
      top: buttonPosition.bottom + window.scrollY,
      left: buttonPosition.left + window.scrollX,
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
      this.selectedItem.studyPrograms.push(program);
    }
    this.menuOpen = false;
    // TODO: Backend request
  }

  onRemoveStudyProgram(item: T, program: StudyProgram) {
    // Remove the study program from the items's studyPrograms array
    const index = item.studyPrograms.findIndex(sp => sp.id === program.id);
    if (index !== -1) {
      item.studyPrograms.splice(index, 1);
    }
    // TODO: Backend request
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
}