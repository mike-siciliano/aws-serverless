import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { ApiStack, DataStack } from '../../../scrapbook-services/cfn-outputs.json';
import { ScrapbookEntry } from "../components/model/model";
import { AuthService } from "./AuthService";

const scrapBookApi = ApiStack.ScrapbookApi + 'scrapbook';

export class DataService {

  private authService: AuthService;
  private s3Client: S3Client | undefined;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  public async getScrapbook(): Promise<ScrapbookEntry[]> {
    const getScrapbookResult = await fetch(scrapBookApi, {
        method: 'GET',
        headers: {
            'Authorization': this.authService.getAuthToken()!
        }
    });

    return await getScrapbookResult.json();
  }

  public async toggleFavorite(scrapbookEntryId: string | undefined, isFavorite: boolean) { 
    if (scrapbookEntryId) {
      await fetch(scrapBookApi + '/' + scrapbookEntryId, {
      method: 'PUT',
      body: JSON.stringify({favorite: isFavorite}),
      headers: {
        'Authorization': this.authService.getAuthToken()!
      }
    });
  }
  }

  public async createScrapbookEntry(name: string, location: string, description?: string, image?: File) { 
      
    const scrapbookEntry: ScrapbookEntry = {
      name: name,
      location: location,
      description: description
    };

    if (image) {
      const uploadUrl = await this.uploadPublicFile(image);
      scrapbookEntry.imageUrl = uploadUrl;
    }

    const result = await fetch(scrapBookApi, {
      method: 'POST',
      body: JSON.stringify(scrapbookEntry),
      headers: {
        'Authorization': this.authService.getAuthToken()!
      }
    });

    const jsonResult = await result.json();
    console.log(` Created scrapbook entry ${jsonResult.id}: ${scrapbookEntry.name}`)

    return scrapbookEntry.name
  }

  private async uploadPublicFile(file: File){
    const credentials = await this.authService.getTemporaryCredentials();
    if (!this.s3Client) {
        this.s3Client = new S3Client({
            credentials: credentials as any,
            region: ApiStack.AwsRegion
        });
    }
    const command = new PutObjectCommand({
        Bucket: DataStack.ScrapbookPhotosBucketName,
        Key: file.name,
        ACL: 'public-read',
        Body: file
    });
    await this.s3Client.send(command);
    return `https://${command.input.Bucket}.s3.${ApiStack.AwsRegion}.amazonaws.com/${command.input.Key}`
  }
 
}