import { ScrapbookEntry } from "../model/model";
import { MissingFieldError } from "./Errors";


export function validateEntry(arg: ScrapbookEntry) { 
  if (!(arg).id) {
    throw new MissingFieldError('id');
  }
  if (!(arg).name) {
    throw new MissingFieldError('name');
  }
  if (!(arg).location) {
    throw new MissingFieldError('location');
  }
}