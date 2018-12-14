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
