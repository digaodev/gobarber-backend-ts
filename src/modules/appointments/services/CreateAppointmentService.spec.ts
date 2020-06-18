import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

import CreateAppointmentService from './CreateAppointmentService';

describe('CreateAppointment', () => {
  it('should be able to create a new appointment', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );
    const provider_id = '123';

    const createdAppointment = await createAppointment.execute({
      provider_id,
      date: new Date(),
    });

    expect(createdAppointment).toHaveProperty('id');
    expect(createdAppointment.provider_id).toBe(provider_id);
  });

  it('should NOT be able to create two appointments on the same time', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );
    const provider_id = '123';
    const date = new Date(2020, 4, 10, 11);

    const createdAppointment = await createAppointment.execute({
      provider_id,
      date,
    });

    expect(createdAppointment).toHaveProperty('id');
    expect(createdAppointment.provider_id).toBe(provider_id);

    expect(
      createAppointment.execute({
        provider_id,
        date,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
