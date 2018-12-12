import { Injectable } from '@angular/core';
import { Note } from './note';

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  constructor() { }

  getNotesPlainText(): string {
    return localStorage.getItem('myNotes');
  }

  getNotes(notesText?: string) : Note[] {
    var notes = null;
    if (notesText) {
      notes = notesText;
    }
    else {
      notes = this.getNotesPlainText();
    }

    if (notes != null && notes != '' && notes != undefined) {
        console.log(notes);
        return JSON.parse(notes);
    }
    return [];
  }

  saveNotesText(notes: string) {
    localStorage.setItem('myNotes', notes);
  }

  saveNotes(notes: Note[]) {
    this.saveNotesText(JSON.stringify(notes));
  }
}
