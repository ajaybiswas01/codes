import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "count",
  pure: false
})
export class CountPipe implements PipeTransform {
  transform(value: any, field = 'selected'): any {
    const filter = value.filter(item => {
      return item[field] === true;
    });
    return Object.keys(filter).length;
  }
}
