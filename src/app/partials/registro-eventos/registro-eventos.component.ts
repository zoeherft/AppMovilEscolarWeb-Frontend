import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FacadeService } from 'src/app/services/facade.service';
import { EventosService } from 'src/app/services/eventos.service';

// Importaciones para el DatePicker
declare var M: any;

@Component({
  selector: 'app-registro-eventos',
  templateUrl: './registro-eventos.component.html',
  styleUrls: ['./registro-eventos.component.scss']
})
export class RegistroEventosComponent implements OnInit {

  @Input() datos_evento: any = {};

  public evento: any = {};
  public errors: any = {};
  public editar: boolean = false;
  public token: string = "";
  public idEvento: number = 0;

  // Opciones para los selects
  public tiposEvento: string[] = [];
  public publicoObjetivoOpciones: string[] = [];
  public programasEducativos: { value: string, label: string }[] = [];
  public responsables: any[] = [];

  // Para los checkboxes de público objetivo
  public publicoSeleccionado: { [key: string]: boolean } = {
    'Estudiantes': false,
    'Profesores': false,
    'Público general': false
  };

  // Para mostrar/ocultar programa educativo
  public mostrarProgramaEducativo: boolean = false;

  // Fecha mínima para el datepicker (hoy)
  public minDate: Date = new Date();

  constructor(
    private location: Location,
    public activatedRoute: ActivatedRoute,
    private eventosService: EventosService,
    private facadeService: FacadeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Cargar opciones
    this.tiposEvento = this.eventosService.getTiposEvento();
    this.publicoObjetivoOpciones = this.eventosService.getPublicoObjetivo();
    this.programasEducativos = this.eventosService.getProgramasEducativos();

    // Obtener token
    this.token = this.facadeService.getSessionToken();

    // Cargar responsables
    this.cargarResponsables();

    // Verificar si es edición
    if (this.activatedRoute.snapshot.params['id'] != undefined) {
      this.editar = true;
      this.idEvento = this.activatedRoute.snapshot.params['id'];
      console.log("ID Evento: ", this.idEvento);

      // Cargar datos del evento
      this.cargarDatosEvento();
    } else {
      // Nuevo evento
      this.evento = this.eventosService.esquemaEvento();
    }
  }

  public cargarResponsables(): void {
    this.eventosService.obtenerResponsables().subscribe(
      (response) => {
        this.responsables = response;
        console.log("Responsables cargados: ", this.responsables);
      },
      (error) => {
        console.error("Error al cargar responsables: ", error);
      }
    );
  }

  public cargarDatosEvento(): void {
    this.eventosService.obtenerEventoPorID(this.idEvento).subscribe(
      (response) => {
        this.evento = response;
        console.log("Evento cargado: ", this.evento);

        // Parsear público objetivo
        if (this.evento.publico_objetivo) {
          try {
            const publico = JSON.parse(this.evento.publico_objetivo);
            publico.forEach((p: string) => {
              this.publicoSeleccionado[p] = true;
            });
            this.evento.publico_objetivo = publico;
            this.actualizarPublicoObjetivo();
          } catch (e) {
            console.error("Error parsing publico_objetivo", e);
          }
        }

        // Asignar responsable_id si existe
        if (this.evento.responsable) {
          this.evento.responsable_id = this.evento.responsable;
        }
      },
      (error) => {
        console.error("Error al cargar evento: ", error);
        alert("Error al cargar los datos del evento");
        this.router.navigate(['/eventos-academicos']);
      }
    );
  }

  public regresar(): void {
    this.location.back();
  }

  // Actualiza el array de público objetivo cuando cambian los checkboxes
  public actualizarPublicoObjetivo(): void {
    const seleccionados: string[] = [];
    for (const key in this.publicoSeleccionado) {
      if (this.publicoSeleccionado[key]) {
        seleccionados.push(key);
      }
    }
    this.evento.publico_objetivo = seleccionados;

    // Mostrar/ocultar programa educativo
    this.mostrarProgramaEducativo = this.publicoSeleccionado['Estudiantes'];

    // Limpiar programa educativo si ya no aplica
    if (!this.mostrarProgramaEducativo) {
      this.evento.programa_educativo = '';
    }
  }

  // Formatear fecha para enviar al backend
  private formatearFecha(fecha: Date | string): string {
    if (!fecha) return '';
    const d = new Date(fecha);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Formatear hora para enviar al backend
  private formatearHora(hora: string | Date): string {
    if (!hora) return '';
    if (hora instanceof Date) {
      return hora.toTimeString().slice(0, 5);
    }
    // Si ya es string en formato HH:MM o HH:MM:SS
    return hora.slice(0, 5);
  }

  public registrar(): void {
    // Validar
    this.errors = {};
    this.errors = this.eventosService.validarEvento(this.evento, false);

    if (Object.keys(this.errors).length > 0) {
      console.log("Errores de validación: ", this.errors);
      return;
    }

    // Preparar datos
    const data = {
      ...this.evento,
      fecha_realizacion: this.formatearFecha(this.evento.fecha_realizacion),
      hora_inicio: this.formatearHora(this.evento.hora_inicio),
      hora_fin: this.formatearHora(this.evento.hora_fin)
    };

    console.log("Datos a enviar: ", data);

    // Enviar al backend
    this.eventosService.registrarEvento(data).subscribe(
      (response) => {
        console.log("Evento registrado: ", response);
        alert("Evento registrado exitosamente");
        this.router.navigate(['/eventos-academicos']);
      },
      (error) => {
        console.error("Error al registrar evento: ", error);
        alert("Error al registrar el evento: " + (error.error?.error || 'Error desconocido'));
      }
    );
  }

  public actualizar(): void {
    // Validar
    this.errors = {};
    this.errors = this.eventosService.validarEvento(this.evento, true);

    if (Object.keys(this.errors).length > 0) {
      console.log("Errores de validación: ", this.errors);
      return;
    }

    // Confirmar actualización
    if (!confirm("¿Estás seguro de que deseas actualizar este evento?")) {
      return;
    }

    // Preparar datos
    const data = {
      id: this.idEvento,
      ...this.evento,
      fecha_realizacion: this.formatearFecha(this.evento.fecha_realizacion),
      hora_inicio: this.formatearHora(this.evento.hora_inicio),
      hora_fin: this.formatearHora(this.evento.hora_fin)
    };

    console.log("Datos a actualizar: ", data);

    // Enviar al backend
    this.eventosService.actualizarEvento(data).subscribe(
      (response) => {
        console.log("Evento actualizado: ", response);
        alert("Evento actualizado exitosamente");
        this.router.navigate(['/eventos-academicos']);
      },
      (error) => {
        console.error("Error al actualizar evento: ", error);
        alert("Error al actualizar el evento: " + (error.error?.error || 'Error desconocido'));
      }
    );
  }

  // Función para permitir solo letras, números y espacios
  public soloAlfanumerico(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);
    // Permitir letras, números, espacios y caracteres acentuados
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]$/.test(event.key) && event.key !== 'Backspace' && event.key !== 'Delete' && event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
      event.preventDefault();
    }
  }

  // Función para permitir solo números
  public soloNumeros(event: KeyboardEvent): void {
    if (!/^[0-9]$/.test(event.key) && event.key !== 'Backspace' && event.key !== 'Delete' && event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
      event.preventDefault();
    }
  }
}
