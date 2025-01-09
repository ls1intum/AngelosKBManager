import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarFilterComponent } from './sidebar-filter.component';

describe('SidebarFilterComponent', () => {
  let component: SidebarFilterComponent;
  let fixture: ComponentFixture<SidebarFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
