import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../../service/users/usuarios.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  constructor(
    public userService: UsuariosService,
    private router: Router,
    private cookieService: CookieService
  ) {}
  username: string = '';
  password: string = '';
  ngOnInit(): void {
    // this.getData();
  }

  TodosLosDatos: any[] = [];

  // getData() {
  //   this.userService.getData('login').subscribe((data) => {
  //     this.TodosLosDatos = data;
  //     console.log(this.TodosLosDatos);
  //   });
  // }

  // onSubmit() {
  //   const user = this.TodosLosDatos.find(
  //     (user) =>
  //       user.username === this.username && user.password === this.password
  //   );
  //   this.userService.login(user).subscribe(data) =>  {
  // if (user) {
  //   alert('Sus datos son correctos');

  //   this.userService.conseguirUsuariologuaeado(user.username);
  //   this.userService.setToken(user.token);

  //   this.router.navigate(['/home']);

  //   user.nombre = this.userService.nombreUsuario;
  // } else {
  //   alert('Sus datos son incorrectos');
  // }
  // }}

  login() {
    const user = { username: this.username, password: this.password };
    this.userService.login(user).subscribe((data) => {
      if (user) {
        alert('sus datos son correctos');
        this.userService.conseguirUsuariologuaeado(user.username);
        this.userService.setToken(data.token);

        // Guarda los datos del usuario en una cookie
        this.cookieService.set('loggedInUser', JSON.stringify(data.user), 7); // Expira en 7 días

        this.router.navigate(['home']);
        user.username = this.userService.nombreUsuario;
      } else {
        alert('datos incorrectos');
      }
    });
  }
}
