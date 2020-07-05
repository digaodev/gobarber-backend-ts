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
    const appointmentDate = new Date(2020, 4, 10, 13); // 10/May/2020 13:00

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime(); // 10/May/2020 12:00
    });

    const createdAppointment = await createAppointment.execute({
      provider_id,
      user_id,
      date: appointmentDate,
    });

    expect(createdAppointment).toHaveProperty('id');
    expect(createdAppointment.provider_id).toBe(provider_id);
  });

  it('should NOT be able to create two appointments on the same time', async () => {
    const provider_id = '123';
    const user_id = 'abc';
    const appointmentDate = new Date(2020, 4, 10, 13); // 10/May/2020 13:00

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime(); // 10/May/2020 12:00
    });

    const createdAppointment = await createAppointment.execute({
      provider_id,
      user_id,
      date: appointmentDate,
    });

    expect(createdAppointment).toHaveProperty('id');
    expect(createdAppointment.provider_id).toBe(provider_id);

    await expect(
      createAppointment.execute({
        provider_id,
        user_id,
        date: appointmentDate,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should NOT be able to create an appointment on a past date', async () => {
    const provider_id = '123';
    const user_id = 'abc';
    const appointmentDate = new Date(2020, 4, 10, 11); // 10/May/2020 11:00

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime(); // 10/May/2020 12:00
    });

    await expect(
      createAppointment.execute({
        provider_id,
        user_id,
        date: appointmentDate,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should NOT be able to create an appointment with itself (same user and provider ID)', async () => {
    const provider_id = '123';
    const user_id = '123';
    const appointmentDate = new Date(2020, 4, 10, 13); // 10/May/2020 13:00

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime(); // 10/May/2020 12:00
    });

    await expect(
      createAppointment.execute({
        provider_id,
        user_id,
        date: appointmentDate,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should NOT be able to create an appointment outside working hours (18-7)', async () => {
    const provider_id = '123';
    const user_id = 'abc';
    const appointmentDateBeforeWH = new Date(2020, 4, 11, 7); // 11/May/2020 07:00
    const appointmentDateAfterWH = new Date(2020, 4, 11, 18); // 11/May/2020 18:00

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime(); // 10/May/2020 12:00
    });

    await expect(
      createAppointment.execute({
        provider_id,
        user_id,
        date: appointmentDateBeforeWH,
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        provider_id,
        user_id,
        date: appointmentDateAfterWH,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
