import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut,updateProfile, User, user, UserCredential } from '@angular/fire/auth';
import { Firestore,doc,docData,setDoc } from '@angular/fire/firestore';
import { map, from, switchMap, catchError,Observable ,throwError,tap, of} from 'rxjs';
import { LoginUser, RegisterUser, UserAuth, UserDocument} from '../Types/Types';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  firebaseAuth = inject(Auth);
  firestore = inject(Firestore);
  router=inject(Router)
  // currentUser$:Observable<UserAuth | null> = user(this.firebaseAuth).pipe(
  //   map((user: User) => {
  //     if (user) {
  //       const { displayName, email, uid } = user;
  //       return { userName: displayName, email, userId: uid };
  //     } else {
  //       return user;
  //     }
  //   })
  // );
  currentUser$: Observable<UserAuth | null> = user(this.firebaseAuth).pipe(
    switchMap((user: User | null) => {
      if (user) {
        const { displayName, email, uid } = user;
        // Fetch additional user data including profile image
        const userDocRef = doc(this.firestore, `users/${uid}`);
        return docData(userDocRef).pipe(
          map((userData: UserDocument) => ({
            userName: displayName,
            email,
            userId: uid,
            profileImageUrl: userData.imageUrl
          })),
          catchError(() => of({
            userName: displayName,
            email,
            userId: uid,
            profileImageUrl: ""
          }))
        );
      } else {
        return of(null);
      }
    })
  );
  register(user: RegisterUser) {
    return from(
      createUserWithEmailAndPassword(
        this.firebaseAuth,
        user.email,
        user.password
      )
    ).pipe(
      switchMap((response) =>
        from(
          updateProfile(response.user, {
            displayName: `${user.firstName} ${user.secondName}`,
          })
        )
      ),
      switchMap(() => {
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
      }),
      tap(()=>{
        this.router.navigate(['profilepic'])
      }),
      catchError(this.handleError)
    );
  }
  logout() {
    return from(signOut(this.firebaseAuth)).pipe(
      tap(()=>{
        this.router.navigate(['signin'])
      })
    );
  }
  login(user: LoginUser) {
    return from(
      signInWithEmailAndPassword(this.firebaseAuth, user.email, user.password)
    ).pipe(
      tap(()=>{
        this.router.navigate(['home'])
      }),
      catchError(this.handleError))
  }
  private handleError(err: any): Observable<never> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `${err.code}: ${err.message}`;
    }
    console.error(err);
    return throwError(()=>new Error(errorMessage));
  }

  constructor() {}
}
