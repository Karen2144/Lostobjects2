import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { MensajesService } from '../../../service/mensajes/mensajes.service';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '../../../service/users/usuarios.service';
import { Router, RouterLink } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { EmojiComponent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';

@Component({
  selector: 'app-mensajes',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    CommonModule,
    HeaderComponent,
    CommonModule,
    PickerComponent,
  ],
  templateUrl: './mensajes.component.html',
  styleUrl: './mensajes.component.css',

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MensajesComponent implements OnInit {
  toggleMenu: boolean = false;
  foto = '';
  idUser = 0;
  imageFile: File | null = null;

  chats: any[] = [];
  messages: any[] = [];
  selectedChat: any;
  newMessage: string = '';

  //

  showEmojiPicker: boolean = false;
  set: string = 'twitter'; // Puedes cambiar el set de emojis si lo deseas

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event: any) {
    const { newMessage } = this;
    // Concatenar el emoji seleccionado al mensaje actual
    const text = `${newMessage}${event.emoji.native}`;
    this.newMessage = text;
    // Cerrar el picker de emojis después de seleccionar (si lo prefieres)
    this.showEmojiPicker = false;
  }

  onFocus() {
    // Ocultar el picker de emojis cuando el campo de mensaje obtiene el foco
    this.showEmojiPicker = false;
  }

  onBlur() {
    console.log('onblur');
  }
  
  //

  constructor(
    private chatService: MensajesService,
    private UsuariosService: UsuariosService,
    private router: Router,
    private cookies: CookieService,
   
  ) {}
  ngOnInit(): void {
    this.getChats();


    const loggedInUser = this.cookies.get('loggedInUser');
    if (loggedInUser) {
      const user = JSON.parse(loggedInUser);
      this.idUser = user.id;
      this.foto = 'http://localhost:8000/' + user.imagen_perfil;
      
      // Llamar a otros métodos como `publications` si es necesario
    } else {
      this.router.navigate(['/login']);
    }
  }

  getChats(): void {
    this.chatService.getChats().subscribe((chats) => {
      this.chats = chats;
      console.log(this.chats);
    });
  }

  selectChat(chat: any): void {
    this.selectedChat = chat;
    this.getMessages(chat.id);
  }

  getMessages(chatId: number): void {
    this.chatService.getMessages(chatId).subscribe((messages) => {
      this.messages = messages;
    });
  }


onFileSelected(event: any): void {
  const file: File = event.target.files[0];
  if (file) {
    this.imageFile = file;
  }
}

sendMessage(): void {
  if (this.newMessage.trim() || this.imageFile) {
    const formData = new FormData();
    formData.append('chat', this.selectedChat.id.toString());
    formData.append('content', this.newMessage);
    formData.append('sender', this.idUser.toString());
    if (this.imageFile) {
      formData.append('image', this.imageFile);
    }

    this.chatService.sendMessage(formData).subscribe((message) => {
      this.messages.push(message);
      this.newMessage = '';
      this.imageFile = null;
    });
  }
}


  ShowMenu() {
    this.toggleMenu = !this.toggleMenu;
  }

  logout() {
    this.UsuariosService.logout();
    this.router.navigate(['/login']);
  }
}