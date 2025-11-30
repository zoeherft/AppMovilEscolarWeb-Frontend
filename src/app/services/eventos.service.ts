import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FacadeService } from './facade.service';
import { ErrorsService } from './tools/errors.service';
import { ValidatorService } from './tools/validator.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class EventosService {

  constructor(
    private http: HttpClient,
    private validatorService: ValidatorService,
    private errorService: ErrorsService,
    private facadeService: FacadeService
  ) { }

  // Esquema del formulario de evento
  public esquemaEvento() {
    return {
      'nombre_evento': '',
      'tipo_evento': '',
      'fecha_realizacion': '',
      'hora_inicio': '',
      'hora_fin': '',
      'lugar': '',
      'publico_objetivo': [],
      'programa_educativo': '',
      'responsable_id': null,
      'descripcion': '',
      'cupo_maximo': ''
    }
  }

  // Opciones para los selects
  public getTiposEvento(): string[] {
    return ['Conferencia', 'Taller', 'Seminario', 'Concurso'];
  }

  public getPublicoObjetivo(): string[] {
    return ['Estudiantes', 'Profesores', 'Público general'];
  }

  public getProgramasEducativos(): { value: string, label: string }[] {
    return [
      { value: 'ICC', label: 'Ingeniería en Ciencias de la Computación' },
      { value: 'LCC', label: 'Licenciatura en Ciencias de la Computación' },
      { value: 'ITI', label: 'Ingeniería en Tecnologías de la Información' }
    ];
  }

  // Validación del formulario
  public validarEvento(data: any, editar: boolean): any {
    console.log("Validando evento... ", data);
    let error: any = {};

    // 1. Nombre del evento: obligatorio, solo letras, números y espacios
    if (!this.validatorService.required(data["nombre_evento"])) {
      error["nombre_evento"] = this.errorService.required;
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]+$/.test(data["nombre_evento"])) {
      error["nombre_evento"] = "Solo se permiten letras, números y espacios";
    }

    // 2. Tipo de evento: obligatorio
    if (!this.validatorService.required(data["tipo_evento"])) {
      error["tipo_evento"] = this.errorService.required;
    }

    // 3. Fecha de realización: obligatoria, no anterior a hoy
    if (!this.validatorService.required(data["fecha_realizacion"])) {
      error["fecha_realizacion"] = this.errorService.required;
    } else {
      const fechaEvento = new Date(data["fecha_realizacion"]);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      if (fechaEvento < hoy) {
        error["fecha_realizacion"] = "La fecha no puede ser anterior a hoy";
      }
    }

    // 4. Horario: hora inicio < hora fin
    if (!this.validatorService.required(data["hora_inicio"])) {
      error["hora_inicio"] = this.errorService.required;
    }
    if (!this.validatorService.required(data["hora_fin"])) {
      error["hora_fin"] = this.errorService.required;
    }
    if (data["hora_inicio"] && data["hora_fin"]) {
      if (data["hora_inicio"] >= data["hora_fin"]) {
        error["hora_fin"] = "La hora de fin debe ser posterior a la hora de inicio";
      }
    }

    // 5. Lugar: solo caracteres alfanuméricos y espacios
    if (!this.validatorService.required(data["lugar"])) {
      error["lugar"] = this.errorService.required;
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-\.]+$/.test(data["lugar"])) {
      error["lugar"] = "Solo se permiten caracteres alfanuméricos y espacios";
    }

    // 6. Público objetivo: al menos uno seleccionado
    if (!data["publico_objetivo"] || data["publico_objetivo"].length === 0) {
      error["publico_objetivo"] = "Debe seleccionar al menos un público objetivo";
    }

    // 7. Programa educativo: obligatorio si Estudiantes está seleccionado
    if (data["publico_objetivo"] && data["publico_objetivo"].includes('Estudiantes')) {
      if (!this.validatorService.required(data["programa_educativo"])) {
        error["programa_educativo"] = "Debe seleccionar un programa educativo cuando el público incluye estudiantes";
      }
    }

    // 8. Responsable: obligatorio
    if (!data["responsable_id"]) {
      error["responsable_id"] = this.errorService.required;
    }

    // 9. Descripción: obligatoria, máximo 300 caracteres, letras, números y signos básicos
    if (!this.validatorService.required(data["descripcion"])) {
      error["descripcion"] = this.errorService.required;
    } else if (data["descripcion"].length > 300) {
      error["descripcion"] = "La descripción no puede exceder los 300 caracteres";
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\.\,\;\:\!\?\-\(\)]+$/.test(data["descripcion"])) {
      error["descripcion"] = "Solo se permiten letras, números y signos de puntuación básicos";
    }

    // 10. Cupo máximo: solo números enteros positivos, máximo 3 dígitos
    if (!this.validatorService.required(data["cupo_maximo"])) {
      error["cupo_maximo"] = this.errorService.required;
    } else if (!this.validatorService.numeric(data["cupo_maximo"])) {
      error["cupo_maximo"] = this.errorService.numeric;
    } else if (parseInt(data["cupo_maximo"]) <= 0) {
      error["cupo_maximo"] = "El cupo debe ser un número positivo";
    } else if (data["cupo_maximo"].toString().length > 3) {
      error["cupo_maximo"] = "El cupo máximo no puede tener más de 3 dígitos";
    }

    return error;
  }

  // --- Servicios HTTP ---

  // Registrar nuevo evento
  public registrarEvento(data: any): Observable<any> {
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders;
    if (token) {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    }
    return this.http.post<any>(`${environment.url_api}/eventos/`, data, { headers });
  }

  // Obtener lista de eventos
  public obtenerListaEventos(): Observable<any> {
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders;
    if (token) {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    }
    return this.http.get<any>(`${environment.url_api}/lista-eventos/`, { headers });
  }

  // Obtener evento por ID
  public obtenerEventoPorID(idEvento: number): Observable<any> {
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders;
    if (token) {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    }
    return this.http.get<any>(`${environment.url_api}/eventos/?id=${idEvento}`, { headers });
  }

  // Actualizar evento
  public actualizarEvento(data: any): Observable<any> {
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders;
    if (token) {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    }
    return this.http.put<any>(`${environment.url_api}/eventos/`, data, { headers });
  }

  // Eliminar evento
  public eliminarEvento(idEvento: number): Observable<any> {
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders;
    if (token) {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    }
    return this.http.delete<any>(`${environment.url_api}/eventos/?id=${idEvento}`, { headers });
  }

  // Obtener lista de responsables (maestros y administradores)
  public obtenerResponsables(): Observable<any> {
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders;
    if (token) {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    }
    return this.http.get<any>(`${environment.url_api}/responsables/`, { headers });
  }
}
