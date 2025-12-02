import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
import { MaestrosService } from 'src/app/services/maestros.service';
import { EliminarUserModalComponent } from '../../modals/eliminar-user-modal/eliminar-user-modal.component';
import { EditarUserModalComponent } from '../../modals/editar-user-modal/editar-user-modal.component';

@Component({
  selector: 'app-maestros-screen',
  templateUrl: './maestros-screen.component.html',
  styleUrls: ['./maestros-screen.component.scss']
})
export class MaestrosScreenComponent implements OnInit {

  public name_user: string = "";
  public rol: string = "";
  public token: string = "";
  public lista_maestros: any[] = [];

  //Para la tabla
  displayedColumns: string[] = ['id', 'id_trabajador', 'nombre', 'email', 'fecha_nacimiento', 'telefono', 'rfc', 'cubiculo', 'area_investigacion', 'editar', 'eliminar'];
  dataSource = new MatTableDataSource<DatosUsuario>(this.lista_maestros as DatosUsuario[]);

  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) {
    if (paginator) {
      this.dataSource.paginator = paginator;
    }
  }
  @ViewChild(MatSort) set sort(sort: MatSort) {
    if (sort) {
      this.dataSource.sort = sort;
    }
  }

  constructor(
    public facadeService: FacadeService,
    public maestrosService: MaestrosService,
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.name_user = this.facadeService.getUserCompleteName();
    this.rol = this.facadeService.getUserGroup();
    //Validar que haya inicio de sesión
    //Obtengo el token del login
    this.token = this.facadeService.getSessionToken();
    console.log("Token: ", this.token);
    if(this.token == ""){
      this.router.navigate(["/"]);
    }

    // Ajustar columnas según el rol - solo admin puede editar/eliminar
    if (!this.isAdmin()) {
      this.displayedColumns = this.displayedColumns.filter(col => col !== 'eliminar' && col !== 'editar');
    }

    //Obtener maestros
    this.obtenerMaestros();
  }

  // Verificar si es administrador
  public isAdmin(): boolean {
    return this.rol === 'administrador';
  }

  // Puede editar: solo administradores
  public canEdit(): boolean {
    return this.isAdmin();
  }

  // Puede eliminar: solo administradores
  public canDelete(): boolean {
    return this.isAdmin();
  }

  ngAfterViewInit() {
    // El paginator y sort se asignan automáticamente via los setters de @ViewChild
  }

  // Consumimos el servicio para obtener los maestros
  //Obtener maestros
  public obtenerMaestros() {
    this.maestrosService.obtenerListaMaestros().subscribe(
      (response) => {
        this.lista_maestros = response;
        console.log("Lista users: ", this.lista_maestros);
        if (this.lista_maestros.length > 0) {
          this.lista_maestros.forEach(usuario => {
            usuario.first_name = usuario.user.first_name;
            usuario.last_name = usuario.user.last_name;
            usuario.email = usuario.user.email;
          });
          console.log("Maestros: ", this.lista_maestros);
        }
        // Solo actualizar los datos, no recrear el dataSource
        this.dataSource.data = this.lista_maestros as DatosUsuario[];
      }, (error) => {
        console.error("Error al obtener la lista de maestros: ", error);
        alert("No se pudo obtener la lista de maestros");
      }
    );
  }

  //Filtrar datos de la tabla
  public filtrar(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public goEditar(idUser: number) {
    if (!this.canEdit()) {
      alert("No tienes permisos para editar maestros");
      return;
    }

    const dialogRef = this.dialog.open(EditarUserModalComponent, {
      data: { id: idUser, rol: 'maestro' },
      height: '288px',
      width: '328px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.isEdit) {
        this.router.navigate(["registro-usuarios/maestros/" + idUser]);
      }
    });
  }

  public delete(idUser: number) {
    if (!this.canDelete()) {
      alert("No tienes permisos para eliminar maestros");
      return;
    }

    const dialogRef = this.dialog.open(EliminarUserModalComponent,{
      data: {id: idUser, rol: 'maestro'},
      height: '288px',
      width: '328px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.isDelete){
        console.log("Maestro eliminado");
        alert("Maestro eliminado correctamente.");
        //Recargar página
        window.location.reload();
      }else{
        alert("Maestro no se ha podido eliminar.");
        console.log("No se eliminó el maestro");
      }
    });
  }

}

//Esto va fuera de la llave que cierra la clase
export interface DatosUsuario {
  id: number,
  id_trabajador: number;
  first_name: string;
  last_name: string;
  email: string;
  fecha_nacimiento: string,
  telefono: string,
  rfc: string,
  cubiculo: string,
  area_investigacion: string,
}

