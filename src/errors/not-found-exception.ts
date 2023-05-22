export class NotFoundException extends Error {
  context?: string;

  constructor(message: string, context?: string) {
    super(message);
    this.context = context;
  }
}
