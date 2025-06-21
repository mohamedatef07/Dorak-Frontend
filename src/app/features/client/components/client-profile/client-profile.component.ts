import { Component, inject, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { IClientUpdate } from '../../models/IClientUpdate';
import { ClientService } from '../../services/client.service';
import { IClientProfile } from '../../models/IClientProfile';
import { AvatarModule } from 'primeng/avatar';
import { AuthService } from '../../../../services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-Client-Profile2',
  imports:[AvatarModule,RouterLink],
  templateUrl: './Client-Profile.component.html',
  styleUrls: ['./Client-Profile.component.css']
})
export class ClientProfileComponent implements OnInit {
cAuthServices = inject(AuthService);

client: IClientProfile = {
Appointments: [],
  ID: '',
  Name: '',
  Image: '',
  Phone: '',
  Email: '',




}
userid: string = '';

 profile: IClientUpdate | null = null;
fullImagePath: string = '';
   clientServices = inject(ClientService);


   constructor(private _clientService:ClientService) { }

 getclientProfile(): void {
   this._clientService.getClientProfile().subscribe({
     next: (res) => {
       this.profile = res.Data;
             console.log(res.Data)

       if (this.profile?.Image) {
         this.fullImagePath = `${environment.apiUrl}${this.profile.Image}`;
             console.log( this.fullImagePath)

       }
     },
     error: (err) => console.error('Error loading profile:', err)
   });
 }


   ngOnInit() :void{
 this.getclientProfile();
  this.userid = this.cAuthServices.getUserId();

   this.userid = this.cAuthServices.getUserId();

  this.clientServices.getClientProfileAndAppointments(this.userid).subscribe({
    next: (res) => {
      this.client = res.Data;
      console.log(res.Data.Image);
      this.client.Image = environment.apiUrl + res.Data.Image;
    },
    error: (err) => {
      console.error('Error while fetching client profile:', err);
    },
  });
   }


}

