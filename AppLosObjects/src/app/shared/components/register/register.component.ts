import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsuariosService } from '../../../service/users/usuarios.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  constructor(private userService: UsuariosService, private router: Router) {}

  ngOnInit(): void {
    // this.getData();
  }

  TodosLosDatos: any[] = [];

  newUser = {
    username: '',
    first_name: '',
    last_name: '',
    edad: '',
    telefono: '',
    ubicacion: '',
    email: '',
    password: '',
  };

  // getData() {
  //   this.userService.getData('register').subscribe((data) => {
  //     this.TodosLosDatos = data;
  //     console.log(this.TodosLosDatos);
  //   });
  // }

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.userService.addUser(this.newUser).subscribe(
        (Response) => {
          alert('Has hecho el registro con éxito');
          this.userService.setToken(Response.token);
          this.router.navigate(['/login']);
        },
        (Error) => {
          alert('Hay un error');
        }
      );
    }
  }
}
