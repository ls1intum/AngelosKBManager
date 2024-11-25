import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionsCellComponent } from './actions-cell.component';

describe('ActionsCellComponent', () => {
  let component: ActionsCellComponent;
  let fixture: ComponentFixture<ActionsCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionsCellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionsCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
