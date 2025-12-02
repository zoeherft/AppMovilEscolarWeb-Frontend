import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { EliminarUserModalComponent } from '../../modals/eliminar-user-modal/eliminar-user-modal.component';
import { EditarUserModalComponent } from '../../modals/editar-user-modal/editar-user-modal.component';

@Component({
  selector: 'app-alumnos-screen',
  templateUrl: './alumnos-screen.component.html',
  styleUrls: ['./alumnos-screen.component.scss']
})
export class AlumnosScreenComponent implements OnInit {

  public name_user: string = "";
  public rol: string = "";
  public token: string = "";
  public lista_alumnos: any[] = [];

  //Para la tabla
  displayedColumns: string[] = ['id', 'matricula', 'nombre', 'email', 'curp', 'fecha_nacimiento', 'telefono', 'rfc', 'ocupacion', 'editar', 'eliminar'];
  dataSource = new MatTableDataSource<DatosAlumno>(this.lista_alumnos as DatosAlumno[]);

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
    public alumnosService: AlumnosService,
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

    //Obtener alumnos
    this.obtenerAlumnos();
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

  //Obtener alumnos
  public obtenerAlumnos() {
    this.alumnosService.obtenerListaAlumnos().subscribe(
      (response) => {
        this.lista_alumnos = response;
        console.log("Lista alumnos: ", this.lista_alumnos);
        if (this.lista_alumnos.length > 0) {
          this.lista_alumnos.forEach(usuario => {
            usuario.first_name = usuario.user.first_name;
            usuario.last_name = usuario.user.last_name;
            usuario.email = usuario.user.email;
          });
          console.log("Alumnos: ", this.lista_alumnos);
        }
        // Solo actualizar los datos, no recrear el dataSource
        this.dataSource.data = this.lista_alumnos as DatosAlumno[];
      }, (error) => {
        console.error("Error al obtener la lista de alumnos: ", error);
        alert("No se pudo obtener la lista de alumnos");
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
      alert("No tienes permisos para editar alumnos");
      return;
    }

    const dialogRef = this.dialog.open(EditarUserModalComponent, {
      data: { id: idUser, rol: 'alumno' },
      height: '288px',
      width: '328px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.isEdit) {
        this.router.navigate(["registro-usuarios/alumno/" + idUser]);
      }
    });
  }

  public delete(idUser: number) {
    if (!this.canDelete()) {
      alert("No tienes permisos para eliminar alumnos");
      return;
    }

    const dialogRef = this.dialog.open(EliminarUserModalComponent,{
      data: {id: idUser, rol: 'alumno'},
      height: '288px',
      width: '328px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.isDelete){
        console.log("Alumno eliminado");
        alert("Alumno eliminado correctamente.");
        window.location.reload();
      }else{
        alert("Alumno no se ha podido eliminar.");
        console.log("No se eliminó el alumno");
      }
    });
  }

}

//Interfaz para los datos de alumno
export interface DatosAlumno {
  id: number;
  matricula: string;
  first_name: string;
  last_name: string;
  email: string;
  curp: string;
  fecha_nacimiento: string;
  telefono: string;
  rfc: string;
  edad: number;
  ocupacion: string;
}
