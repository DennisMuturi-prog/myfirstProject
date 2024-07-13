import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { collection, collectionData } from '@angular/fire/firestore';
import { Product } from '../Types/Types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProoductService {
  authService=inject(AuthService)
  products$=this.getProducts()
  getProducts():Observable<Product[]>{
    const productCollection=collection(this.authService.firestore,'products')
    return collectionData<Product[]>(productCollection)
  }
  constructor() { }
}
