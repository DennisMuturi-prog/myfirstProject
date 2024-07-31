import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CheckoutService } from '../../services/checkout.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CurrencyPipe } from '@angular/common';

interface Order{
  orderId:string,
  totalPrice:number
}

@Component({
  selector: 'app-mpesa-payment-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    CurrencyPipe
  ],
  templateUrl: './mpesa-payment-dialog.component.html',
  styleUrl: './mpesa-payment-dialog.component.css',
})
export class MpesaPaymentDialogComponent {
  checkOutService = inject(CheckoutService);
  readonly orderDetails: Order = inject(MAT_DIALOG_DATA);
  phoneNumber = new FormControl('', Validators.required);
  readonly dialogRef = inject(MatDialogRef<MpesaPaymentDialogComponent>);
  onNoClick(): void {
    this.dialogRef.close();
  }
  onPayment(): void {
    const phoneNo=this.phoneNumber.value
    if(phoneNo){
      this.checkOutService.initiateMpesaPayment(this.orderDetails.orderId,phoneNo).subscribe(()=>{
        this.dialogRef.close()
      })
    }
  }
}
