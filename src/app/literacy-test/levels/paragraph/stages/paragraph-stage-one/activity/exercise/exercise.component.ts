import { NgRedux, select } from '@angular-redux/store';
import {
  ChangeDetectorRef,
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ExerciseAnswer } from 'src/app/models/types/exercise-answer';
import { GameLevel } from 'src/app/models/types/game-level';
import { GameType } from 'src/app/models/types/game-type';
import { GameService } from 'src/app/services/game.service';
import { ParagraphStageOneService } from 'src/app/services/paragraph/paragraph-stage-one.service';
import { SnackbarComponent } from 'src/app/shared/components/snackbar/snackbar.component';
import { IAppState } from 'src/redux/store';
import {
  SUBMIT_GAME_STAGE_RESULT,
  SUBMIT_GAME_STAGE_RESULT_ERROR,
  SUBMIT_GAME_STAGE_RESULT_SUCCESS,
} from 'src/redux/_game.store/game.actions';

@Component({
  selector: 'app-exercise',
  templateUrl: './exercise.component.html',
  styleUrls: ['./exercise.component.scss'],
})
export class ExerciseComponent implements OnInit, OnChanges {
  @select((s) => s.SpeechTexts.speechTexts) speechTexts$: any;
  @select((s) => s.SpeechTexts.isLoading) speechTextsIsLoading$: any;
  @select((s) => s.game.gameSession) gameSession$: any;
  @select((s) => s.game.isLoading) isLoading$: any;
  gameSessionId: any;
  resultTexts = '';
  resultTextList: any[] = [];
  textPosition = 0;
  speechText!: string;
  isCorrect = false;
  isFinishedMessage!: string;
  stageNumber: number = 1;
  successMessage: any;
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  durationInSeconds = 10;
  gameLevel = GameLevel.PARAGRAPH;
  constructor(
    public _paragraphStageOneSvc: ParagraphStageOneService,
    private _router: Router,
    private cdr: ChangeDetectorRef,
    private ngRedux: NgRedux<IAppState>,
    private _gameSvc: GameService,
    private _snackBar: MatSnackBar
  ) {
    this._paragraphStageOneSvc?.init();
    this.speechText = this._paragraphStageOneSvc.text;
  }

  ngOnInit(): void {
    this.GetExerciseTexts();
    // this._paragraphStageOneSvc?.init();
    // this.speechText = this._paragraphStageOneSvc.text;
    // console.log('this.speechText: ', this.speechText);
    // let x = this._paragraphStageOneSvc.GetVoiceText();
    // 
    this.cdr.detectChanges();
    this.onTestTexts();
    this.onGetGameSessionId();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // this._paragraphStageOneSvc.speechToTextBehaviorSubj.subscribe(
    //   (text: any) => {
    //     if (text) {
    //     }
    //   }
    // );
  }

  onGetGameSessionId() {
    this._gameSvc.LoadGameSession();
    this.gameSession$.subscribe({
      next: (data: any) => {
        
        this.gameSessionId = data?.session_id;
      },
    });
  }

  GetExerciseTexts() {
    this.resultTextList = this._paragraphStageOneSvc.GetExerciseTexts();
  }
  onTestTexts() {
    this.speechTexts$.subscribe({
      next: (response: any) => {
        if (response) {
          
          let speechText = response.replace(/\s/g, '');
          let resultTexts = this.resultTexts.replace(/\s/g, '');
          console.warn(
            this.resultTexts.replace(/\s/g, '') == response.replace(/\s/g, '')
          );
          // if (speechText == resultTexts) {
          //   this.isCorrect = true;
          // }

          this.resultTextList.findIndex((obj: any) => {
            ////console.warn('obj: ', obj.text.replace(/\s/g, ''));
            //console.warn('speechText: ', speechText);
            //console.warn('obj----speechText: ', obj == speechText);
            // obj.text.replace(/\s/g, '') == speechText
          });

          let objIndex = this.resultTextList.findIndex(
            (obj: any) => obj.text.replace(/\s/g, '') == speechText
          );
          //Log object to Console.
          // console.warn('Before update: ', this.resultTextList[objIndex]);
          //Update object's name property.
          if (this.resultTextList[objIndex]) {
            this.resultTextList[objIndex].isDone = true;
            this.textPosition += 1;
            // console.warn('this.textPosition: ', this.textPosition);
            this.onTestValues(this.resultTextList);
            this.clearService();
          }
          //Log object to console again.
          
        }
      },
      error: (err: any) => {
        console.error('Error: ', err);
      },
    });
  }

  onTestValues(List: any) {
    let complete = List.filter((done: any) => done?.isDone == true);

    

    if (complete.length == List?.length) {
      
      this.stopService();
      // alert('completed!!!');
      // this.textPosition += 1;
      // this.stopService();
      // this.clearService();

      const Payload: ExerciseAnswer = {
        session_id: this.gameSessionId,
        answer: '4',
        data: List,
      };
     
      this.onSubmit(Payload);
    }
  }
  startService() {
    this._paragraphStageOneSvc.start();
  }

  stopService() {
    this._paragraphStageOneSvc.stop();
  }

  clearService() {
    this._paragraphStageOneSvc.clear();
  }

  onSubmit(Result: ExerciseAnswer) {
    
    this.ngRedux.dispatch({ type: SUBMIT_GAME_STAGE_RESULT });
    this._paragraphStageOneSvc.SubmitGameStageResult(Result).subscribe({
      next: (response: any) => {
        if (response) {
          
          this.openSnackBar(response?.message);
          setTimeout(() => {
            this.isFinishedMessage = '';
            this.successMessage = '';
            // alert('completed!!!');
            this.ngRedux.dispatch({
              type: SUBMIT_GAME_STAGE_RESULT_SUCCESS,
              payload: Result,
            });
            this._router.navigate([
              `/${GameType.LITERACY}/stage-completion/${this.gameLevel}/${this.stageNumber}`,
            ]);
          }, 3000);
        }
      },
      error: (err: any) => {
        if (err) {
          console.warn('Error: ', err);
          this.ngRedux.dispatch({
            type: SUBMIT_GAME_STAGE_RESULT_ERROR,
            payload: err,
          });
        }
      },
    });
  }

  openSnackBar(data: any) {
    this._snackBar.openFromComponent(SnackbarComponent, {
      duration: this.durationInSeconds * 1000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      data: data,
    });
  }
}
