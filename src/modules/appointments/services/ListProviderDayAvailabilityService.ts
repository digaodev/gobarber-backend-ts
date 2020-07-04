import { inject, injectable } from 'tsyringe';
import { getHours, isAfter } from 'date-fns';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

type IResponse = Array<{
  hour: number;
  available: boolean;
}>;

@injectable()
class ListProviderDayAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    day,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
      {
        provider_id,
        day,
        month,
        year,
      },
    );

    const hourStart = 8;
    const hourEnd = 18;

    const eachHourArray = Array.from(
      Array(hourEnd - hourStart),
      (_, index) => index + hourStart,
    );

    const currentDate = new Date(Date.now());

    const availability = eachHourArray.map(hour => {
      const appointmentDate = new Date(year, month - 1, day, hour);

      // an appointment can only be booked in the future
      if (isAfter(currentDate, appointmentDate)) {
        return {
          hour,
          available: false,
        };
      }

      // with a valid appointment date, check if it is already booked
      const appointmentsInHour = appointments.find(
        ap => getHours(ap.date) === hour,
      );

      return {
        hour,
        available: !appointmentsInHour,
      };
    });

    return availability;
  }
}

export default ListProviderDayAvailabilityService;
