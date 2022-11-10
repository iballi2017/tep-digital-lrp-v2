import { select } from '@angular-redux/store';
import { Component, OnInit } from '@angular/core';
import { ExerciseAnswer } from 'src/app/models/types/exercise-answer';
import { BasicOperationsAdditionStageTwoService } from 'src/app/services/basic-operations/basic-operations-addition-stage-two.service';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-exercise',
  templateUrl: './exercise.component.html',
  styleUrls: ['./exercise.component.scss']
})
export class ExerciseComponent implements OnInit {
  @select((s) => s.game.gameSession) gameSession$: any;
  @select((s) => s.game.isLoading) isLoading$: any;
  pageTitle: string = 'Can you add the 2-digit numbers here';
  actionWords: any[] = [];
  gameSessionId: any;
  // testLoopNumber: number = 0;

  uiExercise: any[] = [];
  totalStarNumber: number = 5;
  resultNumbers: any = [];
  questionResultNumbers: any = [];
  answerNumber!: any;
  testLoopNumber: number = 0;
  itemIndex: number = 0;

  constructor(
    private _basicOperationsAdditionSvc: BasicOperationsAdditionStageTwoService,
    private _gameSvc: GameService
  ) {}

  ngOnInit(): void {
    this.getActionNumbers();
    this.getresultNumbers();
    this.onGetGameSessionId();
    this.modifyStageArray();
  }

  modifyStageArray() {
    this.questionResultNumbers.forEach((stage: any) => {
      
      let blueTriangleList: any[] = [];
      for (let i = 0; i < stage.figure; i++) {
        blueTriangleList.push({ isDone: true });
      }
      // for (let i = 0; i < this.totalStarNumber - stage.rating; i++) {
      //   blueTriangleList.push('item');
      // }
      let x: any = { ...stage, blueTriangleList: blueTriangleList };
      this.uiExercise.push(x);
    });
    
  }

  onGetGameSessionId() {
    this._gameSvc.LoadGameSession();
    this.gameSession$.subscribe({
      next: (data: any) => {
        
        this.gameSessionId = data?.session_id;
      },
    });
  }

  getActionNumbers() {
    let numbersList = this._basicOperationsAdditionSvc.GetActionNumbers();
    
    this.actionWords = numbersList;
  }
  getresultNumbers() {
    let numbersList = this._basicOperationsAdditionSvc.GetResultNumbers();
    this.resultNumbers = numbersList;
    
    
    this.answerNumber = numbersList?.numbers[this.testLoopNumber].answer;
    this.questionResultNumbers =
      numbersList?.numbers[this.testLoopNumber]?.questionItems;

    // this.modifyStageArray();
  }

  trackResultHint() {
    
    let x = this.resultNumbers.numbers[this.testLoopNumber];
    
    if (x.answer?.isWellPlaced == true) {
      x.isDone = true;
    }
    this.textExercise();
  }

  textExercise() {
    let questionItems = this.resultNumbers.numbers;
    
    let done = questionItems.filter((i: any) => i.isDone == true);
    
    if (done.length < questionItems.length) {
      this.testLoopNumber++;
      setTimeout(() => {
        this.uiExercise = [];
        this.getresultNumbers();
        this.modifyStageArray();
      }, 1200);
    }

    this.onTestValues();
  }

  onTestValues() {
    let questionItems = this.resultNumbers.numbers;
    
    let complete = questionItems.filter((done: any) => done?.isDone == true);

    
    
    

    if (complete.length == questionItems?.length) {
      this.resultNumbers.isComplete = true;
      
      const Payload: ExerciseAnswer = {
        session_id: this.gameSessionId,
        answer: '1',
        data: [this.resultNumbers],
      };
     
      // this.onSubmit(Payload);
    }
  }

  onSelect(item: any) {
    let result = this.resultNumbers?.numbers[this.testLoopNumber];
    
    if (item.figure == result.answer.figure) {
      item.isCorrectNumber = true;
      result.answer.isWellPlaced = true;
      this.trackResultHint();
    } else {
      item.isWrongNumber = true;
      // 
    }
  }

  onReset() {
    this.resultNumbers?.numbers.forEach((element: any) => {
      element.isDone = false;
      element.answer.isWellPlaced = false;
    });
    this.testLoopNumber = 0;
    this.uiExercise = [];
    this.getresultNumbers();
    this.modifyStageArray();
  }

  onSubmit(Payload: any) {}

}
