import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DashboardSqlService } from '../dashboard-sql.service';
@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})

export class FileUploadComponent implements OnInit {

    fileToUpload: File | null = null;

    makingTeams : boolean = false;
    success: boolean = false;

    ifTeam : boolean = true;

    constructor(private toastr: ToastrService, private dsqls : DashboardSqlService, private router:Router) {};

    ngOnInit() {
      this.dsqls.getIfTeam().then((res) => {
        this.ifTeam = res;
      });
    }

    handleFileInput(event: Event){
      const element = event.currentTarget as HTMLInputElement;
      let fileList: FileList | null = element.files;
      this.fileToUpload = fileList[0];
    }

    upload(){
      if(!this.fileToUpload){
        this.toastr.error('Asegurese que haya seleccionado un archivo', "Error con tu archivo");
        return;
      }

      this.makingTeams = true;

      this.dsqls.postFile(this.fileToUpload).subscribe((res) => {
        this.makingTeams = false;

        console.log("resultado: ",res.message);
        
        if(res.success){
          this.success = true;
          this.toastr.success('', "Se crearon los equipos");
        }

        else{
          this.toastr.error('Asegurese que tenga el formato correcto', res.message);
        }

        this.router.navigateByUrl('dashboard');
      });


    }
  }