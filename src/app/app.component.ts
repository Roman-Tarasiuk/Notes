import { Component } from '@angular/core';

import { Note } from './core/note';
import { NotesService } from './core/notes.service';

import { FilterPipe } from './core/filter.pipe';
import { SafeHtmlPipe } from './core/safehtml.pipe';

import { js_beautify } from 'js-beautify';
import hljs from 'highlight.js/lib/highlight';
import cs from 'highlight.js/lib/languages/cs';


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
  searchInTitle: boolean = true;
  searchInDescription: boolean = true;
  searchInText: boolean = true;
  readonly snippetStart: string = '<pre><code class="csharp hljs">';
  readonly snippetEnd: string = '</code></pre>';

  titleEl: HTMLInputElement;
  descriptionEl: HTMLInputElement;
  textEl: HTMLInputElement;

  constructor(notesService: NotesService) {
    this.notesService = notesService;
    this.notes = this.notesService.getNotes();

    if (this.notes.length > 0) {
      this.current = this.notes[0];
      this.highlightCode();
    }

    hljs.registerLanguage('cs', cs);
  }

  formatOutput(text: string): string {
   var tmpStart = '===pre===code class="csharp"===';
   var tmpEnd = '===/code===/pre===';

   var reStart1 = new RegExp(this.snippetStart, 'g');
   var reEnd1 = new RegExp(this.snippetEnd, 'g');

   var reStart2 = new RegExp(tmpStart, 'g');
   var reEnd2 = new RegExp(tmpEnd, 'g');

   var reLt = /</g;
   var reGt = />/g;

   var result = text
               .replace(reStart1, tmpStart)
               .replace(reEnd1, tmpEnd)
               .replace(reLt, '&lt;')
               .replace(reGt, '&gt')
               .replace(reStart2, this.snippetStart)
               .replace(reEnd2, this.snippetEnd)
               .replace(new RegExp(this.snippetStart + '\r*\n', 'g'), this.snippetStart)
               .replace(new RegExp('\r*\n' + this.snippetEnd, 'g'), this.snippetEnd);

   return result;
  }

  highlightCode() {
    setTimeout(() => {
      document.querySelectorAll('code.csharp').forEach((block) => {
        hljs.highlightBlock(block);
      });
    }, 100);
  }

  clicked(n: Note) {
    this.current = n;
    this.highlightCode();
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  codeTemplate() {
    this.initEditorControls();

    const selStart = this.textEl.selectionStart;
    const selEnd = this.textEl.selectionEnd;

    this.current.text = this.textEl.value.substr(0, selStart)
      + this.snippetStart
      + this.textEl.value.substr(selStart, selEnd - selStart)
      + this.snippetEnd
      + this.textEl.value.substr(selEnd);
  }

  beautify() {
    this.initEditorControls();

    const selStart = this.textEl.selectionStart;
    const selEnd = this.textEl.selectionEnd;

    this.current.text = this.textEl.value.substr(0, selStart)
      + js_beautify(this.textEl.value.substr(selStart, selEnd - selStart), {
        'brace_style': 'expand'
      })
      + this.textEl.value.substr(selEnd);
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
    if (this.adding == true) {
      this.current = new Note('', '', '');
    }
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

    this.highlightCode();

    this.updated = true;
  }

  updateNote() {
    this.initEditorControls();

    this.current.title = this.titleEl.value;
    this.current.description = this.descriptionEl.value;
    this.current.text = this.textEl.value;

    this.highlightCode();

    this.updated = true;
  }

  private initEditorControls() {
    this.titleEl = document.getElementById('title') as HTMLInputElement;
    this.descriptionEl = document.getElementById('description') as HTMLInputElement;
    this.textEl = document.getElementById('text') as HTMLInputElement;
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
    this.notesService.saveNotesToFile(this.notes);
  }

  async importNotes(event) {
    var notesText = await this.notesService.openFile(event) as string;
    this.notes = this.notesService.getNotes(notesText);
    if (this.notes.length > 0) {
      this.current = this.notes[0];
      this.updated = true;
      this.highlightCode();
    }
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
