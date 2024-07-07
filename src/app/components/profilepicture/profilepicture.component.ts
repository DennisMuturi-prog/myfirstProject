import { Component, inject, signal } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar'
import { MatButtonModule } from '@angular/material/button';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { CroppedImageResult, DialogcropperComponent } from '../dialogcropper/dialogcropper.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-profilepicture',
  standalone: true,
  imports: [MatToolbarModule,MatButtonModule,MatIconModule],
  templateUrl: './profilepicture.component.html',
  styleUrl: './profilepicture.component.css'
})
export class ProfilepictureComponent {
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

}
