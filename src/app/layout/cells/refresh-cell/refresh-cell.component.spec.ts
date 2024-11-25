import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefreshCellComponent } from './refresh-cell.component';

describe('RefreshCellComponent', () => {
  let component: RefreshCellComponent;
  let fixture: ComponentFixture<RefreshCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RefreshCellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RefreshCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
