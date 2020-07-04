import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();

    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to create a new appointment', async () => {
    const provider_id = '123';
    const user_id = 'abc';

    const createdAppointment = await createAppointment.execute({
      provider_id,
      user_id,
      date: new Date(),
    });

    expect(createdAppointment).toHaveProperty('id');
    expect(createdAppointment.provider_id).toBe(provider_id);
  });

  it('should NOT be able to create two appointments on the same time', async () => {
    const provider_id = '123';
    const user_id = 'abc';
    const date = new Date(2020, 4, 10, 11);

    const createdAppointment = await createAppointment.execute({
      provider_id,
      user_id,
      date,
    });

    expect(createdAppointment).toHaveProperty('id');
    expect(createdAppointment.provider_id).toBe(provider_id);

    await expect(
      createAppointment.execute({
        provider_id,
        user_id,
        date,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
