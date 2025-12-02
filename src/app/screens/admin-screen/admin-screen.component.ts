import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AdministradoresService } from 'src/app/services/administradores.service';
import { FacadeService } from 'src/app/services/facade.service';
import { EliminarUserModalComponent } from '../../modals/eliminar-user-modal/eliminar-user-modal.component';
import { EditarUserModalComponent } from '../../modals/editar-user-modal/editar-user-modal.component';

@Component({
  selector: 'app-admin-screen',
  templateUrl: './admin-screen.component.html',
  styleUrls: ['./admin-screen.component.scss']
})
export class AdminScreenComponent implements OnInit {
  // Variables y métodos del componente
  public name_user: string = "";
  public rol: string = "";
  public token: string = "";
  public lista_admins: any[] = [];

  //Para la tabla
  displayedColumns: string[] = ['id', 'clave_admin', 'nombre', 'email', 'telefono', 'rfc', 'edad', 'ocupacion', 'editar', 'eliminar'];
  dataSource = new MatTableDataSource<DatosAdmin>(this.lista_admins as DatosAdmin[]);

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
    private administradoresService: AdministradoresService,
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    // Lógica de inicialización aquí
    this.name_user = this.facadeService.getUserCompleteName();
    this.rol = this.facadeService.getUserGroup();

    //Validar que haya inicio de sesión
    this.token = this.facadeService.getSessionToken();
    if(this.token == ""){
      this.router.navigate(["/"]);
    }

    // Obtenemos los administradores
    this.obtenerAdmins();
  }

  ngAfterViewInit() {
    // El paginator y sort se asignan automáticamente via los setters de @ViewChild
  }

  //Obtener lista de usuarios
  public obtenerAdmins() {
    this.administradoresService.obtenerListaAdmins().subscribe(
      (response) => {
        this.lista_admins = response;
        console.log("Lista users: ", this.lista_admins);
        if (this.lista_admins.length > 0) {
          this.lista_admins.forEach(admin => {
            admin.first_name = admin.user.first_name;
            admin.last_name = admin.user.last_name;
            admin.email = admin.user.email;
          });
        }
        // Solo actualizar los datos, no recrear el dataSource
        this.dataSource.data = this.lista_admins as DatosAdmin[];
      }, (error) => {
        alert("No se pudo obtener la lista de administradores");
      }
    );
  }

  //Filtrar datos de la tabla
  public filtrar(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public goEditar(idUser: number) {
    const dialogRef = this.dialog.open(EditarUserModalComponent, {
      data: { id: idUser, rol: 'administrador' },
      height: '288px',
      width: '328px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.isEdit) {
        this.router.navigate(["registro-usuarios/administrador/" + idUser]);
      }
    });
  }

  public delete(idUser: number) {
    // Se obtiene el ID del usuario en sesión
    const userIdSession = Number(this.facadeService.getUserId());
    // Administrador puede eliminar cualquier administrador (excepto a sí mismo)
    if (this.rol === 'administrador') {
      const dialogRef = this.dialog.open(EliminarUserModalComponent,{
        data: {id: idUser, rol: 'administrador'},
        height: '288px',
        width: '328px',
      });

      dialogRef.afterClosed().subscribe(result => {
        if(result.isDelete){
          console.log("Administrador eliminado");
          alert("Administrador eliminado correctamente.");
          //Recargar página
          window.location.reload();
        }else{
          alert("No se pudo eliminar el administrador.");
          console.log("No se eliminó el administrador");
        }
      });
    }else{
      alert("No tienes permisos para eliminar administradores.");
    }
  }

}

//Interfaz para los datos de admin
export interface DatosAdmin {
  id: number;
  clave_admin: string;
  first_name: string;
  last_name: string;
  email: string;
  telefono: string;
  rfc: string;
  edad: number;
  ocupacion: string;
}
