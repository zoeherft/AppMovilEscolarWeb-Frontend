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

  // Función auxiliar para convertir hora de formato 12h (hh:mm AM/PM) a 24h (HH:MM) para comparación
  private convertirA24HorasParaComparar(hora: string): string {
    if (!hora) return '';

    // Si ya está en formato 24h (no tiene AM/PM)
    if (!hora.includes('AM') && !hora.includes('PM')) {
      return hora.slice(0, 5);
    }

    // Separar hora y periodo (AM/PM)
    const partes = hora.trim().split(' ');
    if (partes.length !== 2) return hora.slice(0, 5);

    const [tiempo, periodo] = partes;
    const [horasStr, minutosStr] = tiempo.split(':');
    let horas = parseInt(horasStr, 10);
    const minutos = minutosStr || '00';

    if (periodo.toUpperCase() === 'PM' && horas !== 12) {
      horas += 12;
    } else if (periodo.toUpperCase() === 'AM' && horas === 12) {
      horas = 0;
    }

    return `${horas.toString().padStart(2, '0')}:${minutos.slice(0, 2)}`;
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

    // 3. Fecha de realización: obligatoria, no anterior a hoy (solo para nuevos eventos)
    if (!this.validatorService.required(data["fecha_realizacion"])) {
      error["fecha_realizacion"] = this.errorService.required;
    } else if (!editar) {
      // Solo validar fecha futura para nuevos eventos, no para edición
      const fechaEvento = new Date(data["fecha_realizacion"]);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      fechaEvento.setHours(0, 0, 0, 0);
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
      // Convertir a formato 24h para comparar correctamente
      const horaInicio24 = this.convertirA24HorasParaComparar(data["hora_inicio"]);
      const horaFin24 = this.convertirA24HorasParaComparar(data["hora_fin"]);

      if (horaInicio24 >= horaFin24) {
        error["hora_fin"] = "La hora de fin debe ser posterior a la hora de inicio";
      }
    }

    // Validación adicional: si es el día actual, la hora de inicio no puede ser anterior a la hora actual
    if (!editar && data["fecha_realizacion"] && data["hora_inicio"]) {
      const fechaEvento = new Date(data["fecha_realizacion"]);
      const hoy = new Date();

      // Verificar si es el mismo día
      if (fechaEvento.getFullYear() === hoy.getFullYear() &&
          fechaEvento.getMonth() === hoy.getMonth() &&
          fechaEvento.getDate() === hoy.getDate()) {

        const horaInicio24 = this.convertirA24HorasParaComparar(data["hora_inicio"]);
        const [horasInicio, minutosInicio] = horaInicio24.split(':').map(Number);
        const horaActual = hoy.getHours();
        const minutosActuales = hoy.getMinutes();

        if (horasInicio < horaActual || (horasInicio === horaActual && minutosInicio < minutosActuales)) {
          error["hora_inicio"] = "La hora de inicio no puede ser anterior a la hora actual para eventos del día de hoy";
        }
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

  // Obtener estadísticas de eventos (para gráficas)
  public obtenerEstadisticasEventos(): Observable<any> {
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders;
    if (token) {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    }
    return this.http.get<any>(`${environment.url_api}/estadisticas-eventos/`, { headers });
  }
}
