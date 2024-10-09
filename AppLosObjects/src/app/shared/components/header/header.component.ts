import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UsuariosService } from '../../../service/users/usuarios.service';
import { FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { EstadoService } from '../../../service/estado.service';
import { PublicationsService } from '../../../service/publications/publications.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  toggleMenu: boolean = false;
  IsModalOpen: boolean = false;
  baseUrl: string = 'http://localhost:8000/media/';
  nombreUsuario = '';
  foto = '';
  nombre_busqueda: string = '';
  descripcion: string = '';
  searchTerm: string = '';
  publications: any[] = [];

  constructor(
    private router: Router,
    private userService: UsuariosService,
    private cookies: CookieService,
    private melo: EstadoService,
    private publicationsservice:PublicationsService
  ) {
    
  }

  ngOnInit(): void {
    const loggedInUser = this.cookies.get('loggedInUser');
    if (loggedInUser) {
      const user = JSON.parse(loggedInUser);
      this.foto = 'http://localhost:8000/' + user.imagen_perfil;

      // Llamar a otros métodos como `publications` si es necesario
    } else {
      this.router.navigate(['/login']);
    }

    this.publicationsservice.getAllData().subscribe((data: any) => {
      this.publications = data.results;
  });
}

  ShowMenu() {
    this.toggleMenu = !this.toggleMenu;
  }

  ShowModal() {
   this.melo.toggleModal()
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/login']);
  }

  // metodo para filtrar datos
  filterPublications() {
    return this.publications.filter(publication =>
      publication.descripcion.toLowerCase().includes(this.searchTerm.toLowerCase()) 
    );
  }
}