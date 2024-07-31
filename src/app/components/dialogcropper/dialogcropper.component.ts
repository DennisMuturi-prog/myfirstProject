import { Component ,inject, signal} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog'
import {ImageCropperComponent,ImageCroppedEvent} from 'ngx-image-cropper'

interface ImageData{
  image:File
}
export interface CroppedImageResult{
  blob:Blob,
  objectUrl:string
}
@Component({
  selector: 'app-dialogcropper',
  standalone: true,
  imports: [MatDialogModule,MatButtonModule,ImageCropperComponent],
  templateUrl: './dialogcropper.component.html',
  styleUrl: './dialogcropper.component.css'
})
export class DialogcropperComponent {
  readonly imageData:ImageData=inject(MAT_DIALOG_DATA)
  croppedImageResult=signal<CroppedImageResult | undefined>(undefined)
  readonly dialogRef=inject(MatDialogRef<DialogcropperComponent>)
  onNoClick():void{
    this.dialogRef.close()
  }
  imageCropped(event:ImageCroppedEvent){
    const {objectUrl,blob}=event
    if(blob && objectUrl){
      this.croppedImageResult.set({
        blob,
        objectUrl
      })
    }
    
  }

}
