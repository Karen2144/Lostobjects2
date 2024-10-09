import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideHttpClient, withFetch } from '@angular/common/http';

@NgModule({
  declarations: [],
  providers: [provideHttpClient(withFetch())],
  imports: [CommonModule],
})
export class AppModule {}
