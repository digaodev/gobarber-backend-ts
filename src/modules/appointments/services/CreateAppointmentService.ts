import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

// Models
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

// Repositories
import AppointmentsRepository from '@modules/appointments/repositories/AppointmentsRepository';

// Utils
import AppError from '@shared/errors/AppError';

interface Request {
  provider_id: string;
  date: Date;
}

class CreateAppointmentService {
  public async execute({ provider_id, date }: Request): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);
    const appointmentDate = startOfHour(date);

    const hasAppointmentOnSameDate = await appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (hasAppointmentOnSameDate) {
      throw new AppError('This appointment is already booked');
    }

    const newAppointment = appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    await appointmentsRepository.save(newAppointment);

    return newAppointment;
  }
}

export default CreateAppointmentService;
