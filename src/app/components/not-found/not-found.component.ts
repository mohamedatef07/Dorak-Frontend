import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css',
})
export class NotFoundComponent {
  authServices = inject(AuthService);
  router = inject(Router);
  HandelLogOut() {
    this.authServices.logOut().subscribe({
      next: (res) => {
        this.router.navigate(['/login']);
      },
    });
  }
}
