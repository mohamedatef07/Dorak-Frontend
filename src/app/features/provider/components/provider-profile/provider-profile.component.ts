import { Component, OnInit } from '@angular/core';
import { ProviderSidebarComponent } from '../provider-sidebar/provider-sidebar.component';
import {IProviderProfile} from '../../../../types/IProviderProfile'
import { ProviderService } from '../../services/provider.service';
import { GenderType } from '../../../../Enums/GenderType.enum';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-provider-profile',
  standalone: true,
  imports:[ProviderSidebarComponent],
  templateUrl: './provider-profile.component.html',
  styleUrls: ['./provider-profile.component.css']
})
export class ProviderProfileComponent implements OnInit {
profile: IProviderProfile | null = null;
genderEnum = GenderType;
  fullImagePath: string = '';

  constructor(private ProviderPrpfileService:ProviderService) { }

getProviderProfile(): void {
this.ProviderPrpfileService.getProviderProfile().subscribe({
      next: (res) => {
        this.profile = res.Data;

        if (this.profile?.Image) {
          this.fullImagePath = environment.apiUrl + this.profile.Image;
        }
      },
      error: (err) => console.error('Error loading profile:', err)

  });
}




  ngOnInit() :void{
this.getProviderProfile();
  }

}
