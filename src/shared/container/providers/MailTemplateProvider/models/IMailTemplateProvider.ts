import IParseEmailTemplateDTO from '../dtos/IParseEmailTemplateDTO';

export default interface IMailTemplateProvider {
  parse(data: IParseEmailTemplateDTO): Promise<string>;
}
