import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderAppointments: ListProviderAppointmentsService;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProviderAppointments', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    listProviderAppointments = new ListProviderAppointmentsService(
      fakeAppointmentsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list a provider`s appointments for a given day', async () => {
    const provider_id = 'Provider1';
    const user_id = 'User1';

    const appointment1 = await fakeAppointmentsRepository.create({
      provider_id,
      user_id,
      date: new Date(2020, 4, 21, 8, 0, 0), // 21/May/2020 8:00
    });

    const appointment2 = await fakeAppointmentsRepository.create({
      provider_id,
      user_id,
      date: new Date(2020, 4, 21, 9, 0, 0), // 21/May/2020 9:00
    });

    const availability = await listProviderAppointments.execute({
      provider_id,
      day: 21,
      month: 5, // May/2020
      year: 2020,
    });

    expect(availability).toEqual(
      expect.arrayContaining([appointment1, appointment2]),
    );
  });
});
