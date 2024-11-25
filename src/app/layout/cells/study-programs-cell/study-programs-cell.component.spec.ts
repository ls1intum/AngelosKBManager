import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyProgramsCellComponent } from './study-programs-cell.component';

describe('StudyProgramsCellComponent', () => {
  let component: StudyProgramsCellComponent;
  let fixture: ComponentFixture<StudyProgramsCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudyProgramsCellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudyProgramsCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
