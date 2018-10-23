import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'Zap';
  clean;
  dirty;
  list;

  ngAfterViewInit() {
    function Lipsum() {

      this.clean = clean;
      this.dirty = dirty;
      this.canDirty = true;
      this.generateMarkupButton = document.getElementById('generateMarkup');
      this.lipsumParagraphsNum = document.getElementById('lipsumParagraphs');
      this.lipsumWell = document.getElementById('lipsumWell');
      this.canDirty = document.getElementById('lipsumDirty');
      this.minNumSentencesPerParagraph = 5;
      this.maxNumSentencesPerParagraph = 10;
      this.minNumWordsPerSentence = 5;
      this.maxNumWordsPerSentence = 15;

      this.numberOfParagraphs = 3;
      this.maxNumberOfParagraphs = 20;


    }

    Lipsum.prototype.init = function () {

      this.generateLipsumLister();
    };


    // creates the list of words from clean and dirty, if this.canDirty then merge in the dirty
    Lipsum.prototype.initList = function () {

      this.list = null;
      let list;
      if (this.canDirty.checked === true) {

        list = this.clean.slice();

        // push in every dirty word
        for (let i = 0; i < this.dirty.length; i++) {
          list.push(this.dirty[i]);
        }
        this.list = list;

      } else {
        list = this.clean.slice();
        this.list = list;
      }

    };


    //
    Lipsum.prototype.generateLipsumLister = function () {

      this.generateMarkupButton.addEventListener('click', function () {
        lipsum.initList();
        lipsum.generateLipsum();
      });

      // increments num of paras
      document.getElementById('lipsumParagraphsInc').addEventListener('click', function () {
        if (lipsum.numberOfParagraphs < lipsum.maxNumberOfParagraphs) {
          lipsum.numberOfParagraphs += 1;
          lipsum.lipsumParagraphsNum.value = lipsum.numberOfParagraphs + ' Paragraphs';
        }
      });

      // decrements num of paras
      document.getElementById('lipsumParagraphsDec').addEventListener('click', function () {
        if (lipsum.numberOfParagraphs > 1) {
          lipsum.numberOfParagraphs -= 1;
          lipsum.lipsumParagraphsNum.value = lipsum.numberOfParagraphs + ' Paragraphs';
        }
      });
    };


    // Generates the lipsum Paragraphs
    Lipsum.prototype.generateLipsum = function () {


      document.getElementById('lipsumWell').style.display = 'block';
      let finalString = '';


      for (let i = 0; i < this.numberOfParagraphs; i++) {

        const paragraph = this.generateSentences();
        finalString += '<p>' + paragraph + '</p>';

      }

      this.lipsumWell.innerHTML = finalString;
    };


    // generates multiple sentences to form a paragraph
    Lipsum.prototype.generateSentences = function () {

      const sentencesArray = [];
      const numberOfSentences = this.randomNumBetween(this.minNumSentencesPerParagraph, this.maxNumSentencesPerParagraph);

      for (let i = 0; i < numberOfSentences; i++) {

        const numberOfWordsPerSentence = this.randomNumBetween(this.minNumWordsPerSentence, this.maxNumWordsPerSentence);
        const numberOfCommas = this.numberOfCommas(numberOfWordsPerSentence);

        sentencesArray.push(this.generateSentence(numberOfWordsPerSentence, numberOfCommas));

      }

      return sentencesArray.join(' ');

    };

    // determines number of commas depending o
    Lipsum.prototype.numberOfCommas = function (numberOfWordsPerSentence) {
      let numberOfCommas;

      if (numberOfWordsPerSentence <= 4) {
        numberOfCommas = 0;
      } else if (numberOfWordsPerSentence >= 5 && numberOfWordsPerSentence <= 9) {
        numberOfCommas = 1;
      } else if (numberOfWordsPerSentence >= 10) {
        numberOfCommas = 2;
      }

      return numberOfCommas;
    };

    // generates multiple words to form a sentence with proper Capitalisation, full stops, and commas
    Lipsum.prototype.generateSentence = function (numberOfWordsPerSentence, numberOfCommas) {

      let sentence;
      const sentenceArray = [];
      const arrayOfWordsToUse = this.list.slice();

      for (let i = 0; i < numberOfWordsPerSentence; i++) {

        const wordIndex = this.randomNumBetween(0, (arrayOfWordsToUse.length - 1));
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
        if (sentenceArray[j + 1] !== ', ' && sentenceArray[j] !== sentenceArray[sentenceArray.length - 1]) {
          sentenceArray[j] += ' ';
        }
      }

      // join array to make a string then add full stop to complete the sentence
      sentence = sentenceArray.join('');
      sentence += '.';

      // put first char as uppercase + concat with rest of string ommitting the first char
      sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);
      return sentence;

    };

    // return a random number between specified params
    Lipsum.prototype.randomNumBetween = function (min, max) {
      /*
       Author: Francisc
       Source: http://stackoverflow.com/posts/7228322/revisions
       * */
      return Math.floor(Math.random() * (max - min + 1) + min);
    };


    const clean = [
      'Zap', 'eu quero o Zap', 'passa seu Zap', 'por favor',
      'pode passar seu Zap', 'que adicionei um contato que tem no seu Facebook mas não deu certo passa seu Zap',
      'eu quero seu Zap', 'dependente que você seja quero seu Zap',
      'parabéns eu quero seu Zap', 'pode passar seu Zap obrigado', 'tudo que eu mais quero é o seu Zap',
      'que tal passar logo o Zap', 'será que pode ser passar o Zap?',
      'cade o Zap', 'teu Zap eu quero', 'com licença quero seu Zap',
      'Zap é isso mesmo eu quero seu Zap', 'tentei te pegar seu Zap', 'eu, você e o Zap', 'Zap é isso Zap'
    ];

    const dirty = [
      'what a mad eff-bomb', 'that\'s effn\' gammin\''
    ];

    const lipsum = new Lipsum();
    lipsum.init();
  }

}
