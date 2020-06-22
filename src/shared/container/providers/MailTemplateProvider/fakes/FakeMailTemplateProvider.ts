import IMailTemplateProvider from '../models/IMailTemplateProvider';

interface IMessage {
  to: string;
  body: string;
}

export default class FakeMailTemplateProvider implements IMailTemplateProvider {
  public async parse(): Promise<string> {
    return `Mail content`;
  }
}
