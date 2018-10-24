import {
  Component,
  ViewChild,
  ElementRef,
  Renderer,
  OnInit
} from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import * as firebase from 'firebase';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('generate_btn')
  generate_btn: ElementRef;
  @ViewChild('generated_txt')
  generated_txt: ElementRef;

  dirty;
  list = [];
  paragraph;
  selectOptions = [
    { id: 1, value: 1 },
    { id: 2, value: 2 },
    { id: 3, value: 3 },
    { id: 4, value: 4 },
    { id: 5, value: 5 }
  ];
  public clean = [
    'Zap',
    'eu quero o Zap',
    'passa seu Zap',
    'por favor',
    'pode passar seu Zap',
    'que adicionei um contato que tem no seu Facebook mas não deu certo passa seu Zap',
    'eu quero seu Zap',
    'dependente que você seja quero seu Zap',
    'parabéns eu quero seu Zap',
    'pode passar seu Zap obrigado',
    'tudo que eu mais quero é o seu Zap',
    'que tal passar logo o Zap',
    'será que pode ser passar o Zap?',
    'cade o Zap',
    'teu Zap eu quero',
    'com licença quero seu Zap',
    'Zap é isso mesmo eu quero seu Zap',
    'tentei te pegar seu Zap',
    'eu, você e o Zap',
    'Zap é isso Zap'
  ];

  databasePhrases = [];

  form = this.fb.group({
    paragraph: [
      '',
      Validators.compose([Validators.required, Validators.pattern('^[0-9]*$')])
    ]
  });

  public generateMarkupButton = this.generate_btn;
  public lipsumParagraphsNum = this.paragraph;
  public lipsumWell = this.generated_txt;
  public minNumSentencesPerParagraph = 5;
  public maxNumSentencesPerParagraph = 10;
  public minNumWordsPerSentence = 5;
  public maxNumWordsPerSentence = 15;

  public numberOfParagraphs = 3;
  public maxNumberOfParagraphs = 20;

  constructor(
    private renderer: Renderer,
    private fb: FormBuilder,
    private router: Router
  ) { }

  toForm() {
    this.router.navigate(['/form']);
  }

  initList() {
    this.list = null;
    let list;
    list = this.clean.slice();
    this.list = list;
  }

  // Generates the lipsum Paragraphs
  generateLipsum() {
    // this.generated_txt.nativeElement.style.display = 'block';
    let finalString = '';
    for (let i = 0; i < this.paragraph; i++) {
      const paragraph = this.generateSentences();
      finalString += '<p>' + paragraph + '</p>';
    }
    this.renderer.setElementProperty(
      this.generated_txt.nativeElement,
      'innerHTML',
      `${finalString}`
    );
  }

  generateSentences() {
    const sentencesArray = [];
    const numberOfSentences = this.randomNumBetween(
      this.minNumSentencesPerParagraph,
      this.maxNumSentencesPerParagraph
    );

    for (let i = 0; i < numberOfSentences; i++) {
      const numberOfWordsPerSentence = this.randomNumBetween(
        this.minNumWordsPerSentence,
        this.maxNumWordsPerSentence
      );
      const numberOfCommas = this.numberOfCommas(numberOfWordsPerSentence);

      sentencesArray.push(
        this.generateSentence(numberOfWordsPerSentence, numberOfCommas)
      );
    }

    return sentencesArray.join(' ');
  }

  onClick() {
    this.initList();
    this.generateLipsum();
  }

  numberOfCommas(numberOfWordsPerSentence) {
    let numberOfCommas;

    if (numberOfWordsPerSentence <= 4) {
      numberOfCommas = 0;
    } else if (numberOfWordsPerSentence >= 5 && numberOfWordsPerSentence <= 9) {
      numberOfCommas = 1;
    } else if (numberOfWordsPerSentence >= 10) {
      numberOfCommas = 2;
    }

    return numberOfCommas;
  }

  generateSentence(numberOfWordsPerSentence, numberOfCommas) {
    let sentence;
    const sentenceArray = [];
    const arrayOfWordsToUse = this.list.slice();

    for (let i = 0; i < numberOfWordsPerSentence; i++) {
      const wordIndex = this.randomNumBetween(0, arrayOfWordsToUse.length - 1);
      sentenceArray.push(arrayOfWordsToUse[wordIndex]);
      arrayOfWordsToUse.splice(wordIndex, 1);
    }

    // add in necessary commas
    if (numberOfCommas === 1) {
      // add one comma in middle of sentence
      const middleOfSentenceIndex = Math.floor((sentenceArray.length - 1) / 2);
      sentenceArray.splice(middleOfSentenceIndex, 0, ', ');
    } else if (numberOfCommas === 2) {
      // add comma in 1/3 and 2/3 of sentence
      const commaOneIndex = Math.floor((sentenceArray.length - 1) / 3);
      const commaTwoIndex = Math.floor((sentenceArray.length - 1) / 3) * 2;
      sentenceArray.splice(commaOneIndex, 0, ', ');
      sentenceArray.splice(commaTwoIndex, 0, ', ');
    }

    // add spaces in sentence where applicable (not when the next char is a comma, or if is last sentence)
    for (let j = 0; j < sentenceArray.length; j++) {
      if (
        sentenceArray[j + 1] !== ', ' &&
        sentenceArray[j] !== sentenceArray[sentenceArray.length - 1]
      ) {
        sentenceArray[j] += ' ';
      }
    }

    // join array to make a string then add full stop to complete the sentence
    sentence = sentenceArray.join('');
    sentence += '.';

    // put first char as uppercase + concat with rest of string ommitting the first char
    sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);
    return sentence;
  }

  // return a random number between specified params
  randomNumBetween(min, max) {
    /*
     Author: Francisc
     Source: http://stackoverflow.com/posts/7228322/revisions
     * */
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  treatResponse() {
    const phrases = firebase.database().ref('phrases/');
    phrases.on('value', (snapshot) => {
      const res = snapshot.val();
      for (const key in res) {
        if (res.hasOwnProperty(key)) {
          const value = res[key];
          value.forEach(obj => {
            this.clean.push(obj.value);
          });
        }
      }
    });
  }

  ngOnInit() {
    this.treatResponse();
  }
}
