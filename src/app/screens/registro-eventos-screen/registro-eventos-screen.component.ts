import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';

@Component({
  selector: 'app-registro-eventos-screen',
  templateUrl: './registro-eventos-screen.component.html',
  styleUrls: ['./registro-eventos-screen.component.scss']
})
export class RegistroEventosScreenComponent implements OnInit {

  public token: string = "";
  public rol: string = "";
  public editar: boolean = false;
  public idEvento: number = 0;

  constructor(
    public activatedRoute: ActivatedRoute,
    private facadeService: FacadeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Validar que haya inicio de sesión
    this.token = this.facadeService.getSessionToken();
    this.rol = this.facadeService.getUserGroup();

    if (this.token == "") {
      this.router.navigate(["/"]);
      return;
    }

    // Solo administradores pueden registrar/editar eventos
    if (this.rol !== 'administrador') {
      alert("Solo los administradores pueden registrar o editar eventos");
      this.router.navigate(["/eventos-academicos"]);
      return;
    }

    // Verificar si es edición
    if (this.activatedRoute.snapshot.params['id'] != undefined) {
      this.editar = true;
      this.idEvento = this.activatedRoute.snapshot.params['id'];
    }
  }
}
