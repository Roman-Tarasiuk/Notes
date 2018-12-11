import { Component } from '@angular/core';

import { Note } from '../core/note';

import { DomSanitizer } from '@angular/platform-browser'
import { PipeTransform, Pipe } from "@angular/core";

// https://stackoverflow.com/questions/39628007/angular2-innerhtml-binding-remove-style-attribute
// https://medium.com/@ahmedhamedTN/make-styles-work-when-dealing-with-innerhtml-in-angular-ac2d524ba001

@Pipe({ name: 'safeHtml'})
export class SafeHtmlPipe implements PipeTransform  {
  constructor(private sanitized: DomSanitizer) {}
  transform(value) {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  notes: Note[];
  current: Note;
  editing: boolean = false;
  adding: boolean = false;
  searching: boolean = false;
  showHelp: boolean = false;

  titleEl: HTMLInputElement;
  descriptionEl: HTMLInputElement;
  textEl: HTMLInputElement;

  constructor() {
    this.notes = [
      new Note('New note title', 'New note description', 'New note text'),
      new Note('New note title 2', 'New note description 2', 'New note text 2'),
      new Note('New note title 3', 'New note description 3', 'New note text 3')
    ];

    this.current = null;
  }

  clicked(n: Note) {
    this.current = n;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async toggleEditing() {
    if (this.adding) {
      return;
    }

    if (this.current == null)
    {
      return;
    }

    this.editing = !this.editing;

    if (this.editing) {
      await this.sleep(500);
      this.initEditorControls();

      this.titleEl.value = this.current.title;
      this.descriptionEl.value = this.current.description;
      this.textEl.value = this.current.text;
    }
  }

  toggleAdding() {
    if (this.editing) {
      return;
    }

    this.adding = !this.adding;
  }

  toggleHelp() {
    this.showHelp = !this.showHelp;
  }

  cancelModification() {
    this.editing = false;
    this.adding = false;
  }

  addNote() {
    this.initEditorControls();

    this.notes.push(new Note(this.titleEl.value, this.descriptionEl.value, this.textEl.value));

    this.titleEl.value = '';
    this.descriptionEl.value = '';
    this.textEl.value = '';
  }

  updateNote() {
    this.initEditorControls();

    //this.notes.push(new Note(this.titleEl.value, this.descriptionEl.value, this.textEl.value));

    //this.titleEl.value = '';
    //this.descriptionEl.value = '';
    //this.textEl.value = '';

    this.current.title = this.titleEl.value;
    this.current.description = this.descriptionEl.value;
    this.current.text = this.textEl.value;
  }

  private initEditorControls() {
    this.titleEl = document.getElementById('title') as HTMLInputElement;
    this.descriptionEl = document.getElementById('description') as HTMLInputElement;
    this.textEl = document.getElementById('text') as HTMLInputElement;
  }

  search() {
    if (!this.searching) {
      this.searching = true;
    }
    else {

    }
  }
}
