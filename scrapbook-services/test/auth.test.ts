import { fetchAuthSession } from '@aws-amplify/auth';
import { AuthService } from './AuthService';

const testUser = ''; // TODO Add username
const testUserPassword = ''; // TODO Add password

async function testAuth() {
  const service = new AuthService();
  await service.login(testUser, testUserPassword);
 
  const { idToken } = (await fetchAuthSession()).tokens ?? {};
 
  console.log('JWT Token:');
  console.log(idToken?.toString()); // This can be used to make API calls in apis.http
  console.log('');
 
  const credentials = await service.generateTemporaryCredentials(idToken);

  console.log(credentials);
  
  return credentials;
}
 
testAuth();
