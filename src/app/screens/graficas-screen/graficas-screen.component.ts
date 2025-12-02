import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { AdministradoresService } from 'src/app/services/administradores.service';
import { EventosService } from 'src/app/services/eventos.service';
import { FacadeService } from 'src/app/services/facade.service';

@Component({
  selector: 'app-graficas-screen',
  templateUrl: './graficas-screen.component.html',
  styleUrls: ['./graficas-screen.component.scss']
})
export class GraficasScreenComponent implements OnInit{

  //Variables
  public total_user: any = {};
  public estadisticas_eventos: any = {};
  public rol: string = "";
  public token: string = "";

  //Barras
  barChartData = {
    labels: [] as string[],
    datasets: [
      {
        data: [] as number[],
        label: 'Eventos por Tipo',
        backgroundColor: [
          '#F88406',
          '#FCFF44',
          '#82D3FB',
          '#FB82F5',
          '#2AD84A'
        ]
      }
    ]
  }
  barChartOption: any = {
    responsive: false,
    scales: {
      y: {
        ticks: {
          stepSize: 1,
          precision: 0
        },
        beginAtZero: true
      }
    }
  }
  barChartPlugins = [ DatalabelsPlugin ];

  //Circular
  pieChartData = {
    labels: ["Administradores", "Maestros", "Alumnos"],
    datasets: [
      {
        data:[0, 0, 0],
        label: 'Registro de usuarios',
        backgroundColor: [
          '#FCFF44',
          '#F1C8F2',
          '#31E731'
        ]
      }
    ]
  }
  pieChartOption = {
    responsive:false
  }
  pieChartPlugins = [ DatalabelsPlugin ];

  constructor(
    private administradoresServices: AdministradoresService,
    private eventosService: EventosService,
    private facadeService: FacadeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.rol = this.facadeService.getUserGroup();
    this.token = this.facadeService.getSessionToken();

    // Validar que haya inicio de sesión
    if(this.token == ""){
      this.router.navigate(["/"]);
      return;
    }

    // Solo administradores pueden acceder a esta vista
    if(this.rol !== 'administrador'){
      alert("No tienes permisos para acceder a las gráficas");
      this.router.navigate(["/home"]);
      return;
    }

    this.obtenerTotalUsers();
    this.obtenerEstadisticasEventos();
  }

  public obtenerTotalUsers(){
    this.administradoresServices.getTotalUsuarios().subscribe(
      (response)=>{
        this.total_user = response;
        console.log("Total usuarios: ", this.total_user);
        this.actualizarGraficasUsuarios();
      }, (error)=>{
        console.log("Error al obtener total de usuarios ", error);
        alert("No se pudo obtener el total de cada rol de usuarios");
      }
    );
  }

  public obtenerEstadisticasEventos(){
    this.eventosService.obtenerEstadisticasEventos().subscribe(
      (response)=>{
        this.estadisticas_eventos = response;
        console.log("Estadísticas eventos: ", this.estadisticas_eventos);
        this.actualizarGraficasEventos();
      }, (error)=>{
        console.log("Error al obtener estadísticas de eventos ", error);
      }
    );
  }

  private actualizarGraficasUsuarios(): void {
    const admins = this.total_user.admins || 0;
    const maestros = this.total_user.maestros || 0;
    const alumnos = this.total_user.alumnos || 0;

    this.pieChartData = {
      ...this.pieChartData,
      datasets: [
        {
          ...this.pieChartData.datasets[0],
          data: [admins, maestros, alumnos]
        }
      ]
    };
  }

  private actualizarGraficasEventos(): void {
    if (this.estadisticas_eventos.por_tipo && this.estadisticas_eventos.por_tipo.length > 0) {
      const labelsTipo = this.estadisticas_eventos.por_tipo.map((item: any) => item.tipo_evento);
      const datosTipo = this.estadisticas_eventos.por_tipo.map((item: any) => item.cantidad);

      this.barChartData = {
        labels: labelsTipo,
        datasets: [
          {
            data: datosTipo,
            label: 'Eventos por Tipo',
            backgroundColor: [
              '#F88406',
              '#FCFF44',
              '#82D3FB',
              '#FB82F5',
              '#2AD84A'
            ]
          }
        ]
      };
    } else {
      this.barChartData = {
        labels: ['Sin eventos registrados'],
        datasets: [
          {
            data: [0],
            label: 'Eventos por Tipo',
            backgroundColor: ['#CCCCCC']
          }
        ]
      };
    }
  }
}
