import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  styles: [
    `
    .img-iecm-login {
        width: 100%;
    }
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }

        .bg-iecm {
            background: #8C65AA;
        }
        
    `
  ]
})
export class LoginComponent implements OnInit {

  public version: string = environment.version;


  public loginForm: FormGroup = this.fb.group({
    usuario: ['', [Validators.required, Validators.minLength(5)]],
    contrasena: ['', [Validators.required, Validators.minLength(5)]]
  });

  valCheck: string[] = ['remember'];

  password!: string;
  loading: boolean = false;

  constructor(
    // public layoutService: LayoutService,
    private fb: FormBuilder,
    // private usuarioService: UsuarioService,
    private router: Router,
    private adminService: AdminService
  ) { }

  ngOnInit(): void {
    this.clearLS();
  }

  login() {
    if (!this.loginForm.valid) {
      return;
    }


    const usuario = this.loginForm.controls['usuario'].value;
    const contrasena = this.loginForm.controls['contrasena'].value;
    this.loading = true;


    if (!usuario || !contrasena) {
      Swal.fire('Ups', 'Ingresa un usuario y contraseña', 'warning');
      this.loading = false;
      return;
    }

    this.adminService.loginAdmin(this.loginForm.value)
      .subscribe((resp: any) => {

        Swal.fire('Bienvenido admin', '' ,'success');

        this.router.navigateByUrl('/admin');

      }, (err: any) => {
        this.loading = false;
        console.log(err);
        Swal.fire('Error', err.error.msg, 'error');
      })
    // console.log(this.loginForm.value);

  }

  clearLS(){
    localStorage.clear();
  }

}
