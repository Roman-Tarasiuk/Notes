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

  saveNotesToFile(notes: Note[]) {
    this.download(JSON.stringify(notes), 'notes.json.txt', 'text/plain');
  }

  async openFile(event) {
    var that = this;
    var file = event.target.files[0];
    
    // https://stackoverflow.com/questions/51026420/filereader-readastext-async-issues
    return new Promise((resolve, reject) => {
      let content = '';
      const reader = new FileReader();
      
      // Wait till complete
      reader.onloadend = function(e: any) {
        content = e.target.result;
        resolve(content);
      };
      
      // Make sure to handle error states
      reader.onerror = function(e: any) {
        reject(e);
      };
      
      reader.readAsText(file);
    });
  }

  private download(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
  }
}
