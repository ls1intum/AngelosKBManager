import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsiteDialogComponent } from './website-dialog.component';

describe('WebsiteDialogComponent', () => {
  let component: WebsiteDialogComponent;
  let fixture: ComponentFixture<WebsiteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebsiteDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebsiteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
