export class CustomHttpError extends Error {
  public  statusCode: number;

  constructor(message = 'Problemas no servidor! Volte mais tarde', statusCode = 500) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.name = CustomHttpError.name; 
    Object.setPrototypeOf(this, CustomHttpError.prototype);
  }

  static checkAndThrowError(error: unknown): void {
    if (error instanceof CustomHttpError) {
      console.log(error);
      throw error;
    }

    throw new Error();
  }

}


