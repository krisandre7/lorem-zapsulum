import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ValidatorFn, AbstractControl, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import * as firebase from 'firebase';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  form = this.fb.group({
    'phrases': ['', Validators.compose([
      Validators.required
    ])],
  });
  paragraph;
  items = [];

  public validators = [this.multiSearchOr, this.must_be_email];
  public errorMessages = {
    'must_be_valid': 'frase tem que ter +5 caracteres',
    'must_be_zap': 'Deve conter a palavra Zap'
  };

  multiSearchOr(control: FormControl, searchWords) {
    searchWords = ['Zap'];
    const regex = searchWords
      .map(word => '(?=.*\\b' + word + '\\b)')
      .join('');
    const searchExp = new RegExp(regex, 'gi');
    return (searchExp.test(control.value)) ? true : { 'must_be_zap': true };
  }

  must_be_email(control: FormControl) {
    const EMAIL_REGEXP = /^[a-z][a-z\s]*$/;
    if (control.value !== '' && (control.value.length <= 5)) {
      return { 'must_be_valid': true };
    }
    return true;
  }

  onAddingTag(tag) {
    console.log(tag);
  }

  constructor(private fb: FormBuilder, private router: Router) { }

  validator(regexPattern: RegExp, propertyName: string): ValidatorFn {
    return (currentControl: AbstractControl): { [key: string]: any } => {
      if (!regexPattern.test(currentControl.value)) {
        const temp = {};
        temp[propertyName] = true;
        return temp;
      }
    };
  }

  onSubmit(form) {
    const database = firebase.database();
    // Get a key for a new Post.
    const newPostKey = firebase.database().ref().child('posts').push().key;

    // Write the new post's data simultaneously in the posts list and the user's post list.
    const updates = {};
    updates['/phrases/' + newPostKey] = form.value.phrases;
    firebase.database().ref().update(updates, res => {
      console.log(res);
    });
  }

  ngOnInit() {
  }

}
