import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut,updateProfile, User, user, UserCredential } from '@angular/fire/auth';
import { Firestore,doc,setDoc } from '@angular/fire/firestore';
import { map, from, switchMap } from 'rxjs';
import { LoginUser, RegisterUser} from '../Types/Types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  firebaseAuth = inject(Auth);
  firestore = inject(Firestore);
  currentUser$=user(this.firebaseAuth).pipe(
    map((user:User)=>{
      if(user){
          const {displayName,email,uid}=user;
          return {userName:displayName,email,userId:uid}
      }
      else{
        return user
      }
    })
  )
  register(user: RegisterUser) {
    return from(
      createUserWithEmailAndPassword(
        this.firebaseAuth,
        user.email,
        user.password
      )
    ).pipe(
      switchMap((response)=>from(updateProfile(response.user,{displayName:`${user.firstName} ${user.secondName}`}))),
      switchMap(()=>{
        const userRef = doc(
          this.firestore,
          `users/${this.firebaseAuth.currentUser?.uid}`
        );
        const { firstName, secondName, gender, dateOfBirth, marketingSource } =
          user;
        const userObject = {
          firstName,
          secondName,
          gender,
          dateOfBirth,
          marketingSource,
        };
        return from(setDoc(userRef, userObject));
      })
    );
  }
  logout(){
    return from(
      signOut(this.firebaseAuth)
    )
  }
  login(user:LoginUser){
    return from(
      signInWithEmailAndPassword(this.firebaseAuth,
        user.email,
        user.password
      )
    )
  }
 
 

  constructor() {}
}
