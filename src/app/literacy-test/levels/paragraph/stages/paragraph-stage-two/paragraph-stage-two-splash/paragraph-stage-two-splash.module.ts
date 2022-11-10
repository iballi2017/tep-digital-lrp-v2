import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParagraphStageTwoSplashRoutingModule } from './paragraph-stage-two-splash-routing.module';
import { ParagraphStageTwoInstructionalVideoComponent } from './paragraph-stage-two-instructional-video/paragraph-stage-two-instructional-video.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ParagraphStageTwoSplashComponent } from './paragraph-stage-two-splash.component';


@NgModule({
  declarations: [
    ParagraphStageTwoInstructionalVideoComponent,
    ParagraphStageTwoSplashComponent
  ],
  imports: [
    CommonModule,
    ParagraphStageTwoSplashRoutingModule,
    SharedModule
  ]
})
export class ParagraphStageTwoSplashModule { }
