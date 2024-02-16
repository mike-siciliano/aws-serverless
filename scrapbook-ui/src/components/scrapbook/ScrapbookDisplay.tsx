import '../../styles/scrapbook.css';
import { ScrapbookEntry } from "../model/model";

interface ScrapbookDisplayProps extends ScrapbookEntry {
  toggleFavorite: (scrapbookId: string) => void
}

export function ScrapbookDisplay(props: ScrapbookDisplayProps) {

  return (
    <div className={`scrapbook-entry  ${props.favorite ? 'favorite' : ''}`}>
       {props.imageUrl && <img className="scrapbook-image" src={props.imageUrl}/>}
      <label className="name">{props.name}</label>
      <br />
      <label className="location">{props.location}</label>
      <br />
      <label className="description">{props.description}</label>
      <br />
      <button 
        onClick={() => props.toggleFavorite(props.id!)} 
        className={'favorite-button'}>
          {props.favorite ? 'Remove Favorite' : 'Favorite!'}
      </button>
    </div>
  );
}