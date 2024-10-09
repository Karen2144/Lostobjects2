import { Component, OnInit } from '@angular/core';
import { PublicationsService } from '../../../service/publications/publications.service';
import { UsuariosService } from '../../../service/users/usuarios.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { routes } from '../../../app.routes';
import { HeaderComponent } from '../header/header.component';
import { EstadoService } from '../../../service/estado.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, FormsModule, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
toggleLike(arg0: any) {
throw new Error('Method not implemented.');
}
  // Estos son los datos que tienes que crear en API o base de datos ! Para las Publicaciones
  baseUrl: string = 'http://localhost:8000/media/';
  nombreUsuario = '';
  descripcion: string = '';
  imagen: string = '';
  idUser = 0;
  nombre_busqueda: string = '';
  selectedFile: File | null = null;
  base64Image: string | null = null;
  previewUrl: string | null = null;
  foto = '';
  searchTerm: string = '';
  publications: any[] = [];

  constructor(
    private publicationService: PublicationsService,
    private userService: UsuariosService,
    private cookies: CookieService,
    private router: Router,
    private melo: EstadoService,
    private publicationsservice:PublicationsService 
  ) {
    
}

  ngOnInit(): void {
    this.melo.isModalOpen$.subscribe((data)=>{
    this.IsModalOpen=data
    console.log(this.IsModalOpen)

}
)
    this.getData();
    const loggedInUser = this.cookies.get('loggedInUser');
    if (loggedInUser) {
      const user = JSON.parse(loggedInUser);
      this.foto = 'http://localhost:8000/' + user.imagen_perfil;

      // Asignar más información del usuario
      this.idUser = user.id;

      console.log('Usuario id: ', this.idUser);

      // Llamar a otros métodos como `publications` si es necesario
    } else {
      this.router.navigate(['/login']);
    }

  }

  // publications: any = [];

  toggleMenu: boolean = false;

  IsModalOpen: boolean = false;

  ShowMenu() {
    this.toggleMenu = !this.toggleMenu;
  }

  ShowModal() {
    this.melo.toggleModal()
    
  }

  getData() {
    this.publicationService.getData('mostrar').subscribe((data) => {
      this.publications = data.map((publication: any) => {
        // Cambié 'item' a 'publication'
        console.log(data)
        const imageUrl = publication.imagen.startsWith('http') // Cambié 'imagen' a 'imageUrl' para evitar conflicto
          ? publication.imagen
          : `${this.baseUrl}${publication.imagen.replace(/^\/media\//, '')}`;
        return {
          ...publication,
          imagen: imageUrl, // Asigno 'imageUrl' a 'imagen'
        };
      });
    });
  }

  onFiles(event: any): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.base64Image = reader.result as string;
        this.previewUrl = this.base64Image;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  postData() {
    const data_publication = new FormData();
    console.log('Usuario publicacion: ', this.idUser);
    data_publication.append('nombre_usuario', this.idUser.toString());
    data_publication.append('descripcion', this.descripcion.toString());
    data_publication.append('fecha_publicacion', new Date().toISOString());

    if (this.selectedFile) {
      data_publication.append('imagen', this.selectedFile);
    }

    if (this.descripcion !== '') {
      this.publicationService.postData('publicar', data_publication).subscribe(
        (Response) => {
          alert('Has enviado los datos correctamente');
        },
        (Error) => {
          alert('Sus datos no se han enviados correctamente');
          console.error(Error);
        }
      );
      this.ShowModal();
      window.location.reload();
    }
  }

   // metodo para filtrar datos
   filterPublications() {
    return this.publications.filter(publication =>
      publication.descripcion.toLowerCase().includes(this.searchTerm.toLowerCase()) 
    );
  }

  // buscar():void{
  // this.data
  // console.log(this.nombre_busqueda);

  // }
}