import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyProgramFilterButtonComponent } from './study-program-filter-button.component';

describe('StudyProgramFilterComponent', () => {
  let component: StudyProgramFilterButtonComponent;
  let fixture: ComponentFixture<StudyProgramFilterButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudyProgramFilterButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudyProgramFilterButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
