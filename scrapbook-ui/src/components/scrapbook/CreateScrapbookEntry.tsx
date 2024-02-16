

import { SyntheticEvent, useState } from "react";
import { NavLink } from "react-router-dom";
import { AuthService } from "../../services/AuthService";
import { DataService } from "../../services/DataService";

type CreateScrapbookEntryProps = {
  authService: AuthService;
  dataService: DataService;
};

type CustomEvent = {
    target: HTMLInputElement
}

export function CreateScrapbookEntry({ authService, dataService }: CreateScrapbookEntryProps) {
  const [name, setName] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [image, setImage] = useState<File | undefined>();
  const [actionResult, setActionResult] = useState<string>('');

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    if (name && location) {
      const id = await dataService.createScrapbookEntry(name, location, description, image)
      setActionResult(`Created Scrapbook entry with name ${name}`);
      setName('');
      setLocation('');
    } else {
      setActionResult('Please provide a name and a location!');
    }
  };

  function setImageUrl(event: CustomEvent){
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  }

  function renderImage() {
    if (image) {
        const localImageURL = URL.createObjectURL(image)
        return <img alt='' src={localImageURL} style={{ maxWidth: "200px" }}/>
    }
  }

  return ( 
    <div>
      <h2>Add a new memory!</h2>
      {!authService.isSignedIn() && (
        <NavLink to={"/login"}>Please login</NavLink>
      )}
      {authService.isSignedIn() && (
        <form onSubmit={(e) => handleSubmit(e)}>
          <label>Name:</label>
          <br/>
          <input value={name} onChange={(e) => setName(e.target.value)} /><br/>
          <label>Location:</label>
          <br/>
          <input value={location} onChange={(e) => setLocation(e.target.value)} /><br/>
          <label>Description:</label>
          <br/>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} /><br/>
          <label>Photo:</label>
          <br/>
          <input type="file" onChange={(e) => setImageUrl(e)} />
          <br/>
          {renderImage()}
          <br/>
          <input type="submit" value='Create Entry'/>
        </form>
      )}
      {actionResult? <h3>{actionResult}</h3>: undefined}
    </div>
  );
}