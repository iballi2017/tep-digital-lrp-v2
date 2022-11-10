import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-basic-operations-multiplication-stage-three-splash',
  templateUrl: './basic-operations-multiplication-stage-three-splash.component.html',
  styleUrls: ['./basic-operations-multiplication-stage-three-splash.component.scss']
})
export class BasicOperationsMultiplicationStageThreeSplashComponent implements OnInit {
  menuList = [
    {
      title: 'LITERACY',
    },
    {
      title: 'LETTERING',
    },
    {
      title: 'STAGE 1',
    }
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
