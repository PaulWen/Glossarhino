export abstract class CommentDataObject {

  abstract get content(): string;
  abstract set content(content: string);

  abstract get contact(): string;
  abstract set contact(contact: string);

  abstract get email(): string;
  abstract set email(email: string);

  abstract get timeStamp(): Date;
  abstract set timeStamp(timeStamp: Date);

  public static init(contact: string, email: string): CommentDataObject {
    return {
      "content": undefined,
      "contact": contact,
      "email": email,
      "timeStamp": undefined
    };
  }
}
