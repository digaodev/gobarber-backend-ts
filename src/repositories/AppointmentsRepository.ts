import { isEqual } from 'date-fns';

import Appointment from '../models/Appointment';

interface CreateAppointmentDTO {
  provider: string;
  date: Date;
}

class AppointmentsRepository {
  private appointments: Appointment[];

  constructor() {
    this.appointments = [];
  }

  public all(): Appointment[] {
    return this.appointments;
  }

  public findByDate(date: Date): Appointment | null {
    const appointmentFound = this.appointments.find(appointment =>
      isEqual(appointment.date, date),
    );

    return appointmentFound || null;
  }

  public create({ provider, date }: CreateAppointmentDTO): Appointment {
    const newAppointment = new Appointment({ provider, date });

    this.appointments.push(newAppointment);

    return newAppointment;
  }
}

export default AppointmentsRepository;
