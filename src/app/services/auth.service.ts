import { Injectable } from '@angular/core';
import { Observable,from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  register(user:any):Observable<any>{
    return from(user)
  }

  constructor() { }
}
