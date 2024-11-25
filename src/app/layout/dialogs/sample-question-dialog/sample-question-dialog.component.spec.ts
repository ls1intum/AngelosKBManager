import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleQuestionDialogComponent } from './sample-question-dialog.component';

describe('SampleQuestionDialogComponent', () => {
  let component: SampleQuestionDialogComponent;
  let fixture: ComponentFixture<SampleQuestionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SampleQuestionDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SampleQuestionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
