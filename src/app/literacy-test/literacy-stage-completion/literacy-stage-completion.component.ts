import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameType } from 'src/app/models/types/game-type';

@Component({
  selector: 'app-literacy-stage-completion',
  templateUrl: './literacy-stage-completion.component.html',
  styleUrls: ['./literacy-stage-completion.component.scss']
})
export class LiteracyStageCompletionComponent implements OnInit {
  levelTitle!: string;
  stageNumber!: number;
  gameLevel: any;
  gameType = GameType.LITERACY;
  constructor(private _route: ActivatedRoute) {}

  ngOnInit(): void {
    this.getParams();
    // this.levelTitle = 'Lettering';

  }

  getParams() {
    this._route.paramMap.subscribe({
      next: (params: any) => {
        this.stageNumber = params.get('stage-number');
        this.gameLevel = params.get('game-level');
        this.levelTitle =  this.gameLevel;
      },
    });
  }
}
