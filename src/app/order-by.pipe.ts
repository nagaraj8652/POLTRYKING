import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {

  // transform(value: any, ...args: any[]): any {
  //   return null;
  // }

   transform(array, args) {
     return array.sortBy(array, args);
  }
}
