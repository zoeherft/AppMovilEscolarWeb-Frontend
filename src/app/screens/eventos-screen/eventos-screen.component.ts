import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
import { EventosService } from 'src/app/services/eventos.service';
import { EliminarEventoModalComponent } from '../../modals/eliminar-evento-modal/eliminar-evento-modal.component';

@Component({
  selector: 'app-eventos-screen',
  templateUrl: './eventos-screen.component.html',
  styleUrls: ['./eventos-screen.component.scss']
})
export class EventosScreenComponent implements OnInit {

  public name_user: string = "";
  public rol: string = "";
  public token: string = "";
  public lista_eventos: any[] = [];

  // Columnas de la tabla
  displayedColumns: string[] = ['id', 'nombre_evento', 'tipo_evento', 'fecha_realizacion', 'horario', 'lugar', 'publico_objetivo', 'responsable', 'cupo_maximo', 'editar', 'eliminar'];
  dataSource = new MatTableDataSource<DatosEvento>(this.lista_eventos as DatosEvento[]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public facadeService: FacadeService,
    public eventosService: EventosService,
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.name_user = this.facadeService.getUserCompleteName();
    this.rol = this.facadeService.getUserGroup();

    // Validar que haya inicio de sesión
    this.token = this.facadeService.getSessionToken();
    console.log("Token: ", this.token);
    if (this.token == "") {
      this.router.navigate(["/"]);
    }

    // Ajustar columnas según el rol
    if (!this.isAdmin()) {
      // Si no es admin, quitar columnas de editar y eliminar
      this.displayedColumns = this.displayedColumns.filter(col => col !== 'eliminar' && col !== 'editar');
    }

    // Obtener eventos
    this.obtenerEventos();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // Verificar roles
  public isAdmin(): boolean {
    return this.rol === 'administrador';
  }

  public isMaestro(): boolean {
    return this.rol === 'maestro';
  }

  public isAlumno(): boolean {
    return this.rol === 'alumno';
  }

  // Puede editar: solo administradores
  public canEdit(): boolean {
    return this.isAdmin();
  }

  // Puede eliminar: solo administradores
  public canDelete(): boolean {
    return this.isAdmin();
  }

  // Puede registrar: solo administradores
  public canCreate(): boolean {
    return this.isAdmin();
  }

  // Obtener eventos
  public obtenerEventos(): void {
    this.eventosService.obtenerListaEventos().subscribe(
      (response) => {
        this.lista_eventos = response;
        console.log("Lista eventos: ", this.lista_eventos);

        // Procesar datos para la tabla
        if (this.lista_eventos.length > 0) {
          this.lista_eventos.forEach(evento => {
            // Formatear público objetivo
            try {
              const publico = JSON.parse(evento.publico_objetivo);
              evento.publico_objetivo_display = publico.join(', ');
            } catch (e) {
              evento.publico_objetivo_display = evento.publico_objetivo;
            }

            // Formatear horario
            evento.horario_display = `${evento.hora_inicio?.slice(0, 5)} - ${evento.hora_fin?.slice(0, 5)}`;

            // Nombre del responsable
            if (evento.responsable_info) {
              evento.responsable_display = evento.responsable_info.nombre_completo;
            } else {
              evento.responsable_display = 'No asignado';
            }
          });

          this.dataSource = new MatTableDataSource<DatosEvento>(this.lista_eventos as DatosEvento[]);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      },
      (error) => {
        console.error("Error al obtener la lista de eventos: ", error);
        alert("No se pudo obtener la lista de eventos");
      }
    );
  }

  // Filtrar datos de la tabla
  public filtrar(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // Ir a editar evento
  public goEditar(idEvento: number): void {
    if (!this.canEdit()) {
      alert("No tienes permisos para editar eventos");
      return;
    }
    this.router.navigate(["registro-eventos/" + idEvento]);
  }

  // Eliminar evento
  public delete(idEvento: number): void {
    if (!this.canDelete()) {
      alert("Solo los administradores pueden eliminar eventos");
      return;
    }

    const dialogRef = this.dialog.open(EliminarEventoModalComponent, {
      data: { id: idEvento },
      height: '288px',
      width: '328px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.isDelete) {
        console.log("Evento eliminado");
        alert("Evento eliminado correctamente.");
        // Recargar lista
        this.obtenerEventos();
      } else if (result && !result.isDelete) {
        alert("No se pudo eliminar el evento.");
        console.log("No se eliminó el evento");
      }
    });
  }

  // Ir a registrar nuevo evento
  public goRegistrar(): void {
    this.router.navigate(["registro-eventos"]);
  }
}

// Interface para la tabla
export interface DatosEvento {
  id: number;
  nombre_evento: string;
  tipo_evento: string;
  fecha_realizacion: string;
  hora_inicio: string;
  hora_fin: string;
  horario_display: string;
  lugar: string;
  publico_objetivo: string;
  publico_objetivo_display: string;
  programa_educativo: string;
  responsable: number;
  responsable_display: string;
  descripcion: string;
  cupo_maximo: number;
}
