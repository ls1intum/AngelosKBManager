import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleQuestionsComponent } from './sample-questions.component';

describe('SamplequestionsComponent', () => {
  let component: SampleQuestionsComponent;
  let fixture: ComponentFixture<SampleQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SampleQuestionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SampleQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
