import { inject, Injectable } from '@angular/core';
import { ref, Storage, uploadBytesResumable } from '@angular/fire/storage';
import { AuthService } from './auth.service';
import { from } from 'rxjs';
import { doc ,setDoc} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  authService = inject(AuthService);
  firebaseStorage = inject(Storage);
  uploadProfilePhoto(photo: any) {
    const storageRef = ref(
      this.firebaseStorage,
      `profilePhotos/${this.authService.firebaseAuth.currentUser?.uid}`
    );
    return uploadBytesResumable(storageRef, photo);
  }
  addprofilePicurl(imageUrl: string) {
    const userRef = doc(
      this.authService.firestore,
      `users/${this.authService.firebaseAuth.currentUser?.uid}`
    );
    return from(setDoc(
      userRef,
      {
        imageUrl,
      },
      { merge: true }
    ));
  }
  constructor() {}
}
