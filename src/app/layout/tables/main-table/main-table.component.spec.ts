import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainTableComponent } from './main-table.component';
import { Website } from '../../../data/model/website.model';

describe('MainTableComponent', () => {
  let component: MainTableComponent<Website>;
  let fixture: ComponentFixture<MainTableComponent<Website>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainTableComponent<Website>);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
