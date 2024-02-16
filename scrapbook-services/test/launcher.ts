import { handler } from "../src/services/scrapbook/handler";

handler(
  {
    httpMethod: 'POST', 
    body: JSON.stringify({
      name: 'Sloppy Joes\'s',
      location: 'Key West, Florida USA'
    })
  } as any, {} as any).then(result => console.log(result));



  // handler(
  //   {
  //     httpMethod: 'GET'
  //   } as any, {} as any).then(result => console.log(result));


// handler(
//   {
//     httpMethod: 'GET',
//     pathParameters: { id: '' },
//   } as any, {} as any).then(result => console.log(result));

// handler(
//   {
//     httpMethod: 'DELETE',
//     pathParameters: { id: '' },
//   } as any, {} as any).then(result => console.log(result));