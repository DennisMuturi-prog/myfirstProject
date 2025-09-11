import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';
import { ReactiveFormsModule,FormGroup,FormControl,Validators } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { addressMap } from './address';
import { MatSelectModule } from '@angular/material/select';
import { map, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { CheckoutService } from '../../services/checkout.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatRadioModule,
    MatSelectModule,
    AsyncPipe,
    MatProgressSpinnerModule
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent {
  checkoutService=inject(CheckoutService)
  myAddressMap = addressMap;
  isProcessingPayment = false;
  checkOutForm = new FormGroup({
    address: new FormGroup({
      street: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      county: new FormControl('', Validators.required),
      zip: new FormControl('', Validators.required),
    }),
    deliveryForm: new FormGroup({
      typeOfDelivery: new FormControl('', Validators.required),
    }),
    paymentForm: new FormGroup({
      modeOfPayment: new FormControl('', Validators.required),
    }),
  });
  get county() {
    return this.checkOutForm.get('address.county');
  }
  get city() {
    return this.checkOutForm.get('address.city');
  }
  get street() {
    return this.checkOutForm.get('address.street');
  }
  get zip() {
    return this.checkOutForm.get('address.zip');
  }
  get address() {
    return this.checkOutForm.get('address') as FormGroup;
  }
  get deliveryForm() {
    return this.checkOutForm.get('deliveryForm') as FormGroup;
  }
  get paymentForm() {
    return this.checkOutForm.get('paymentForm') as FormGroup;
  }
  get typeOfDelivery() {
    return this.checkOutForm.get('deliveryForm.typeOfDelivery');
  }
  get modeOfPayment() {
    return this.checkOutForm.get('paymentForm.modeOfPayment');
  }
    get isCreditCardSelected(): boolean {
    return this.modeOfPayment?.value === 'Credit card';
  }

  // Helper method to check if button should be disabled
  get isPayButtonDisabled(): boolean {
    return this.isProcessingPayment || !this.checkOutForm.valid;
  }

  // Get payment button text
  get payButtonText(): string {
    if (this.isProcessingPayment) {
      return this.isCreditCardSelected ? 'Redirecting to Payment...' : 'Processing...';
    }
    return 'Pay';
  }
  cities$: Observable<string[] | undefined> | undefined =
    this.county?.valueChanges.pipe(
      map((countyName) =>
        countyName ? this.myAddressMap.get(countyName) : ['Ex']
      )
    );
  onSubmit() {
    console.log(this.checkOutForm.value);
    const {address,deliveryForm,paymentForm}=this.checkOutForm.value
    if(address&&deliveryForm&&paymentForm){
      const {zip,county,city,street}=address
      const {typeOfDelivery}=deliveryForm
      const {modeOfPayment}=paymentForm
      if(zip&&county&&city&&street&&typeOfDelivery&&modeOfPayment){
        const addressInfo={zip,county,street,city}
        const deliveryMethod=typeOfDelivery
        const orderDetails = { addressInfo, deliveryMethod, modeOfPayment };
        this.isProcessingPayment = true;

        this.checkoutService.createOrder(orderDetails).subscribe({
        next: (result) => {
          console.log('Order created successfully:', result);
          this.isProcessingPayment = false;
        },
        error: (error) => {
          console.error('Order creation failed:', error);
          this.isProcessingPayment = false;
        }
      });
      }
    }
    
      
  }
  openErrorMessage(){
    console.log('Form has validation errors');
  }
}
