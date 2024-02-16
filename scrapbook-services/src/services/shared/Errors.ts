
export function notFound404Error() {
  return {
    statusCode: 404,
    body: JSON.stringify('Scrapbook entry Not Found')
  }
}


export class MissingFieldError extends Error {
  constructor(missingField: string) {
    super(`Missing value! Please provide a value for ${missingField}`);
  }
}

export class JSONError extends Error {}