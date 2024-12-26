import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyProgramDialogComponent } from './study-program-dialog.component';

describe('StudyProgramDialogComponent', () => {
  let component: StudyProgramDialogComponent;
  let fixture: ComponentFixture<StudyProgramDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudyProgramDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudyProgramDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
