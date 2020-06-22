import IMailTemplateProvider from '../models/IMailTemplateProvider';
import IParseEmailTemplateDTO from '../dtos/IParseEmailTemplateDTO';

interface IMessage {
  to: string;
  body: string;
}

export default class FakeMailTemplateProvider implements IMailTemplateProvider {
  public async parse(data: IParseEmailTemplateDTO): Promise<string> {
    return data.template;
  }
}
