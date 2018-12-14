import { Pipe, PipeTransform } from '@angular/core';
import { Note } from './note';

// https://codeburst.io/create-a-search-pipe-to-dynamically-filter-results-with-angular-4-21fd3a5bec5c

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: Note[], searchText: string, searchParams: any): Note[] {
    if(!items) return [];
    if(!searchText) return items;

    searchText = searchText.toLowerCase();

    return items.filter( it => {
        return (searchParams.inTitle && it.title.toLowerCase().includes(searchText))
            || (searchParams.inDescription && it.description.toLowerCase().includes(searchText))
            || (searchParams.inText && it.text.toLowerCase().includes(searchText));
        });
    }
}