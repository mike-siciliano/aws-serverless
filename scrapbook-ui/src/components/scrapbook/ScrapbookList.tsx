import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { AuthService } from "../../services/AuthService";
import { DataService } from "../../services/DataService";
import { ScrapbookEntry } from "../model/model";
import { ScrapbookDisplay } from "./ScrapbookDisplay";

interface ScrapbookProps {
  authService: AuthService;
  dataService: DataService;
}

export function ScrapbookList({authService, dataService}: ScrapbookProps){

    const [scrapbook, setScrapbook] = useState<ScrapbookEntry[]>();

    const getScrapbook = async () => {
      const newScrapbook = await dataService.getScrapbook();
      setScrapbook(newScrapbook);
    }

    useEffect(() => {


      if (authService.isSignedIn()) {
        getScrapbook();
      }
    }, [])

    async function toggleFavorite(scrapbookId: string){
        const scrapbookEntry = scrapbook?.find((entry) => {
          return entry.id === scrapbookId;
        });

        if (authService.isSignedIn() && scrapbookEntry) {
          await dataService.toggleFavorite(scrapbookEntry.id, scrapbookEntry?.favorite ? false : true);
          await getScrapbook();
        }
    }

    function renderScrapbook() {
        
      if(!authService.isSignedIn()) {
        return <NavLink to={"/login"}>Please login</NavLink>
      }

      const rows: any[] = [];
        if(scrapbook) {
            for(const item of scrapbook) {
                rows.push(
                    <ScrapbookDisplay 
                        key={item.id}
                        id={item.id}
                        location={item.location}
                        name={item.name}
                        imageUrl={item.imageUrl}
                        description={item.description}
                        favorite={item.favorite}
                        toggleFavorite={toggleFavorite}
                    />
                )
            }
        }

        return rows;
    }

    return (
        <div>
            <h2>Enjoy the memories ...</h2>
            {renderScrapbook()}
        </div>
    )        


}