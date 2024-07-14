import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthSnackbarComponent } from './auth-snackbar.component';

describe('AuthSnackbarComponent', () => {
  let component: AuthSnackbarComponent;
  let fixture: ComponentFixture<AuthSnackbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthSnackbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
