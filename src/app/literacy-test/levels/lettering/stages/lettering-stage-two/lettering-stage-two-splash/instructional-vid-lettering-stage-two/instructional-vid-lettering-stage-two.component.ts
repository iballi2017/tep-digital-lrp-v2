import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-instructional-vid-lettering-stage-two',
  templateUrl: './instructional-vid-lettering-stage-two.component.html',
  styleUrls: ['./instructional-vid-lettering-stage-two.component.scss'],
})
export class InstructionalVidLetteringStageTwoComponent implements OnInit {
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
