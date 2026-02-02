import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-recuperarsenha',
  templateUrl: './recuperarsenha.component.html',
  styleUrl: './recuperarsenha.component.scss'
})
export class RecuperarSenhaComponent {

  email : string = '';
  modalVerification : boolean = false;

  constructor (private router: Router, private auth: AuthService) {}

  openModal() {
    this.modalVerification=true;
    this.recuperarSenha();
  }

  closeModal() {
    this.modalVerification=false;
    this.router.navigate(['/login']);
  }

  recuperarSenha(){
    this.auth.redefinirSenha(this.email);
    this.email = '';
  }

}