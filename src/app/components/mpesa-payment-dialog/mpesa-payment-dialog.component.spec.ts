import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MpesaPaymentDialogComponent } from './mpesa-payment-dialog.component';

describe('MpesaPaymentDialogComponent', () => {
  let component: MpesaPaymentDialogComponent;
  let fixture: ComponentFixture<MpesaPaymentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MpesaPaymentDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MpesaPaymentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
