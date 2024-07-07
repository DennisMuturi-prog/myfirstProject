import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormErrorSnackbarComponent } from './form-error-snackbar.component';

describe('FormErrorSnackbarComponent', () => {
  let component: FormErrorSnackbarComponent;
  let fixture: ComponentFixture<FormErrorSnackbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormErrorSnackbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormErrorSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
