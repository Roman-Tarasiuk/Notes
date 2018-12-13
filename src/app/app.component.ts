import { Component } from '@angular/core';

import { Note } from './core/note';
import { NotesService } from './core/notes.service';

import { DomSanitizer } from '@angular/platform-browser'
import { PipeTransform, Pipe } from "@angular/core";
import { FilterPipe }from './core/filter.pipe';

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
  current: Note = null;
  editing: boolean = false;
  adding: boolean = false;
  searching: boolean = false;
  updated: boolean = false;
  exportImport: boolean = false;
  notesService: NotesService;
  filterString: string = '';

  titleEl: HTMLInputElement;
  descriptionEl: HTMLInputElement;
  textEl: HTMLInputElement;

  constructor(notesService: NotesService) {
    this.notesService = notesService;
    this.notes = this.notesService.getNotes();

    if (this.notes.length > 0) {
      this.current = this.notes[0];
    }
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

  cancelModification() {
    this.editing = false;
    this.adding = false;
  }

  addNote() {
    this.initEditorControls();

    var newNode = new Note(this.titleEl.value, this.descriptionEl.value, this.textEl.value);
    this.notes.push(newNode);
    this.current = newNode;

    this.titleEl.value = '';
    this.descriptionEl.value = '';
    this.textEl.value = '';

    this.updated = true;
  }

  updateNote() {
    this.initEditorControls();

    this.current.title = this.titleEl.value;
    this.current.description = this.descriptionEl.value;
    this.current.text = this.textEl.value;

    this.updated = true;
  }

  private initEditorControls() {
    this.titleEl = document.getElementById('title') as HTMLInputElement;
    this.descriptionEl = document.getElementById('description') as HTMLInputElement;
    this.textEl = document.getElementById('text') as HTMLInputElement;
  }

  toggleSearch() {
    if (!this.searching) {
      this.searching = true;
    }
  }

  saveChanges() {
    this.notesService.saveNotes(this.notes);
    this.updated = false;
  }

  deleteNote() {
    var index = this.notes.indexOf(this.current);

    if (index >= 0) {
      this.notes.splice(index, 1);
      this.updated = true;

      if (this.notes.length > 0) {
        if (index >= this.notes.length) {
          index = this.notes.length - 1;
        }
        this.current = this.notes[index];
      }
    }
  }

  isActive(n: Note) {
    return n == this.current;
  }

  exportNotes() {
    var expImpEl: HTMLInputElement = document.getElementById('expImp') as HTMLInputElement;
    expImpEl.value = this.notesService.getNotesPlainText();
  }

  importNotes() {
    var expImpEl: HTMLInputElement = document.getElementById('expImp') as HTMLInputElement;
    this.notesService.saveNotesText(expImpEl.value);
    this.notes = this.notesService.getNotes(expImpEl.value);
    this.updated = false;
  }

  moveUp(n: Note) {
    var index = this.notes.indexOf(n);

    if (index == 0) {
      return;
    }

    this.notes.splice(index, 1);
    this.notes.splice(index - 1, 0, n);

    this.updated = true;
  }

  moveDown(n: Note) {
    var index = this.notes.indexOf(n);

    if (index == this.notes.length - 1) {
      return;
    }

    this.notes.splice(index, 1);
    this.notes.splice(index + 1, 0, n);

    this.updated = true;
  }
}
