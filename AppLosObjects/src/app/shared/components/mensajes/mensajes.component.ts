import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  HostListener,
  OnInit,
} from '@angular/core';
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
  AllUserList: any = [];
  imagePreview: string | null = null; // Para la previsualización de la imagen
  selectedChat: any;
  newMessage: string = '';

  //

  showEmojiPicker: boolean = false;
  set: string = 'twitter'; // Puedes cambiar el set de emojis si lo deseas
  selectedFileName: string = '';
  filteredUsers: any = [];
  searchTerm: any;

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

  //

  constructor(
    private chatService: MensajesService,
    private UsuariosService: UsuariosService,
    private router: Router,
    private cookies: CookieService
  ) {}
  ngOnInit(): void {
    this.getChats();
    this.allUser();

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

  allUser() {
    this.UsuariosService.DataAllUSer().subscribe((data) => {
      this.AllUserList = data;
      this.filterUsers();
    });
  }

  getChats(): void {
    this.chatService.getChats().subscribe((chats) => {
      this.chats = chats;
      console.log(this.chats);
    });
  }

  selectUser(user: any): void {
    const participants = [this.idUser, user.id];

    // Llamar al backend para obtener o crear un chat
    this.chatService.getOrCreateChat(participants).subscribe((chat) => {
      // Agregar el chat a la lista si es nuevo
      if (!this.chats.find((c) => c.id === chat.id)) {
        this.chats.push(chat);
      }
      // Seleccionar el chat y cargar sus mensajes
      this.selectChat(chat);
    });
  }

  selectChat(chat: any): void {
    this.selectedChat = chat;
    this.getMessages(chat.id);
    console.log(this.selectedChat);
    this.imageFile = null;
    this.filteredUsers = '';
    this.imagePreview = null;
    this.selectedFileName = '';
  }

  // Detectar si se presiona la tecla Esc
  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey(event: KeyboardEvent): void {
    this.clearSelectedChat();
  }

  // Detectar si se presiona la tecla Esc
  @HostListener('document:keydown.enter', ['$event'])
  handleEnterKey(event: KeyboardEvent): void {
    this.sendMessage();
  }

  // Método para limpiar el chat seleccionado
  clearSelectedChat(): void {
    this.selectedChat = null;
    console.log('Chat deseleccionado');
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
      this.selectedFileName = file.name; // Almacenar el nombre del archivo

      // Crear una previsualización de la imagen
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
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

  // Método para filtrar usuarios
  filterUsers(): void {
    // Solo filtra si hay un término de búsqueda
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      this.filteredUsers = this.AllUserList.filter((user: any) =>
        user.username.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      // Si no hay término de búsqueda, no mostrar ningún usuario filtrado
      this.filteredUsers = [];
    }
  }

  logout() {
    this.UsuariosService.logout();
    this.router.navigate(['/login']);
  }
}
