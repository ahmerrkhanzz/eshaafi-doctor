import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats: any[] = [
    {
      icon: 'patient',
      value: 23,
      title: 'Registered Patients',
      class: 'green'
    },
    {
      icon: 'doctor-equipment',
      value: 32,
      title: 'Total Office Visits',
      class: 'blue'
    },
    {
      icon: 'doctor-list',
      value: 4,
      title: 'Pending Consultations',
      class: 'green'
    },
    {
      icon: 'online-consultation',
      value: 48,
      title: 'Completed Consultations',
      class: 'blue'
    }
  ]
  constructor() { }

  ngOnInit(): void {
  }

}
