import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmMailComponent } from './confirm-mail.component';

describe('ConfirmMailComponent', () => {
  let component: ConfirmMailComponent;
  let fixture: ComponentFixture<ConfirmMailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmMailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
