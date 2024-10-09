import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsuariosService } from '../../../service/users/usuarios.service';
import { CookieService } from 'ngx-cookie-service';
import { PublicationsService } from '../../../service/publications/publications.service';
import { ChangeDetectorRef } from '@angular/core';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, RouterLink, HeaderComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  baseUrl: string = 'http://localhost:8000/media/';

  first_name = '';
  last_name = '';
  ubicacion = '';
  email = '';
  telefono = '';
  imagen_perfil: File | null = null;
  foto: string = '';

  constructor(
    private userService: UsuariosService,
    private cookies: CookieService,
    private publiService: PublicationsService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // this.MostrarPerfil()
    const loggedInUser = this.cookies.get('loggedInUser');

    if (loggedInUser) {
      const user = JSON.parse(loggedInUser);
      this.first_name = user.first_name;
      this.last_name = user.last_name;
      this.ubicacion = user.ubicacion;
      this.email = user.email;
      this.telefono = user.telefono;
      this.foto = 'http://localhost:8000/' + user.imagen_perfil;
      console.log('Estos son los datos del usuario: ', user);
    }
  }

  publications: any = [];

  // MostrarPerfil(){
  //   console.log("hola")
  //   this.userService.getData('perfil').subscribe((data) => {
  //     this.Perfil = data;
  //   });
  // }

  getData() {
    this.publiService.getData('mostrar').subscribe((data) => {
      this.publications = data;
    });
  }

  toggleMenu: boolean = false;

  IsModalOpen: boolean = false;

  ShowMenu() {
    this.toggleMenu = !this.toggleMenu;
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/login']);
  }

  onFilesChange(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.imagen_perfil = event.target.files[0];
    }
  }

  //   actualizar() : void{
  //     if(this.imagen_perfil){
  //       const formData = new FormData();

  //     // Aquí asumimos que `this.imagen_perfil` es el archivo de imagen seleccionado
  //     formData.append('imagen_perfil', this.imagen_perfil);

  //     this.userService.actualizar_foto(formData).subscribe(
  //       (data) => {
  //         this.imagen_perfil = data.imagen_perfil; // Maneja la respuesta del servidor
  //         console.log('Imagen actualizada con éxito');
  //         this.onFilesChange
  //       },
  //       (error) => {
  //         console.error('Error al actualizar la imagen', error);
  //       }
  //     );
  //     }
  // }

  actualizar() {
    if (this.imagen_perfil) {
      const formData = new FormData();
      formData.append('imagen_perfil', this.imagen_perfil);

      this.userService.actualizar_foto(formData).subscribe(
        (data) => {
          const timestamp = new Date().getTime();
          // Forzar la actualización de la imagen agregando un timestamp a la URL
          this.foto = `${data.imagen_perfil}?t=${timestamp}`;

          console.log('Imagen actualizada con éxito');

          // Forzar la detección de cambios
          this.cdr.detectChanges();
        },
        (error) => {
          console.error('Error al actualizar la imagen', error);
        }
      );
    }
  }

  ShowModal() {
    this.IsModalOpen = !this.IsModalOpen;
    if (this.IsModalOpen == true) {
    }
  }
}
