import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-instructional-vid-lettering-stage-three-b',
  templateUrl: './instructional-vid-lettering-stage-three-b.component.html',
  styleUrls: ['./instructional-vid-lettering-stage-three-b.component.scss'],
})
export class InstructionalVidLetteringStageThreeBComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    const video = document.querySelector('video');
    video?.addEventListener('ended', this.isEnded, false);
    video?.addEventListener('playing', this.isPlaying, false);
  }
  isEnded() {
    const btn = document.querySelector('.btn-wrapper');
    btn?.classList.remove('d-none');
  }
  isPlaying() {
    const btn = document.querySelector('.btn-wrapper');
    btn?.classList.add('d-none');
  }
}
