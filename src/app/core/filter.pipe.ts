import { Pipe, PipeTransform } from '@angular/core';
import { Note } from './note';

// https://codeburst.io/create-a-search-pipe-to-dynamically-filter-results-with-angular-4-21fd3a5bec5c

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: Note[], searchText: string): Note[] {
    if(!items) return [];
    if(!searchText) return items;

    searchText = searchText.toLowerCase();

    return items.filter( it => {
        return it.text.toLowerCase().includes(searchText)
            || it.description.toLowerCase().includes(searchText)
            || it.text.toLowerCase().includes(searchText);
        });
    }
}