import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-literacy-level-completion',
  templateUrl: './literacy-level-completion.component.html',
  styleUrls: ['./literacy-level-completion.component.scss'],
})
export class LiteracyLevelCompletionComponent implements OnInit {
  levelTitle!: string;
  gameLevel: any;
  constructor(private _route: ActivatedRoute) {}

  ngOnInit(): void {
    this.getParams();
    // this.levelTitle = 'Lettering';
  }

  getParams() {
    this._route.paramMap.subscribe({
      next: (params: any) => {
        // console.log('params: ', params);
        this.gameLevel = params.get('game-level');
        this.levelTitle = this.gameLevel;
      },
    });
  }
}
