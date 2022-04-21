import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';

const URL = 'http://localhost:3000/api/upload';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})

export class FileUploadComponent implements OnInit {
    
  public uploader: FileUploader = new FileUploader({
      url: URL,
      itemAlias: 'file',
    });
    
    constructor() {}
    
    ngOnInit() {
      
      this.uploader.onAfterAddingFile = (file) => {
        file.withCredentials = false;
      };
      
      this.uploader.onCompleteItem = (item: any, status: any) => {
        console.log('Uploaded File Details:', item);
      };
    }
}