import { Component, inject, signal } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar'
import { MatButtonModule } from '@angular/material/button';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { CroppedImageResult, DialogcropperComponent } from '../dialogcropper/dialogcropper.component';
import { MatIconModule } from '@angular/material/icon';
import { StorageService } from '../../services/storage.service';
import { getDownloadURL } from '@angular/fire/storage';
import {MatProgressBarModule} from '@angular/material/progress-bar'
import { Router } from '@angular/router';

@Component({
  selector: 'app-profilepicture',
  standalone: true,
  imports: [MatToolbarModule,MatButtonModule,MatIconModule,MatProgressBarModule],
  templateUrl: './profilepicture.component.html',
  styleUrl: './profilepicture.component.css'
})
export class ProfilepictureComponent {
  progressbarPercent=signal<number>(0)
  storageService=inject(StorageService)
  router=inject(Router)
  croppedImage=signal<SafeUrl>('')
  selectedImage=signal<Blob | undefined>(undefined)
  constructor(private sanitizer:DomSanitizer){
  }
  readonly dialog=inject(MatDialog)
  openDialog(event:any):void{
    const file=event.target?.files[0]
    if(file){
       const dialogRef=this.dialog.open(DialogcropperComponent,{
      data:{
        image:file
      },
      width:'500px'
    })
    dialogRef.afterClosed().subscribe((cropResult:CroppedImageResult)=>{
      if(cropResult!==undefined){
        this.croppedImage.set(this.sanitizer.bypassSecurityTrustUrl(cropResult.objectUrl))
        this.selectedImage.set(cropResult.blob)
      }
    })
    }
   
  }
  uploadProfilePhoto(){
    if(this.selectedImage()){
      const uploadTask=this.storageService.uploadProfilePhoto(this.selectedImage())
      uploadTask.on('state_changed',
        (snapshot)=>{
          const progress=(snapshot.bytesTransferred/snapshot.totalBytes)*100;
          this.progressbarPercent.set(progress)
        },
        (error)=>{
          console.log(error)
        },
        ()=>{
           getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
             console.log('File available at', downloadURL);
             this.storageService.addprofilePicurl(downloadURL).subscribe(()=>{
              this.router.navigate(['home'])
             })

           });

        }
      )
    }

  }

}
