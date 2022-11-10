import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-basic-operations-division-stage-four-splash',
  templateUrl: './basic-operations-division-stage-four-splash.component.html',
  styleUrls: ['./basic-operations-division-stage-four-splash.component.scss']
})
export class BasicOperationsDivisionStageFourSplashComponent implements OnInit {
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
