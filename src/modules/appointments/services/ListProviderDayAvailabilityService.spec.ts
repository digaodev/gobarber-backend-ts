import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';

import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderDayAvailability: ListProviderDayAvailabilityService;

describe('ListProviderDayAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderDayAvailability = new ListProviderDayAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list a provider`s DAY availability', async () => {
    const provider_id = 'Provider1';

    await fakeAppointmentsRepository.create({
      provider_id,
      date: new Date(2020, 4, 20, 8, 0, 0), // 20/May/2020
    });

    await fakeAppointmentsRepository.create({
      provider_id,
      date: new Date(2020, 4, 20, 10, 0, 0), // 20/May/2020
    });

    const availability = await listProviderDayAvailability.execute({
      provider_id,
      day: 20,
      month: 5, // May/2020
      year: 2020,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: true },
        { hour: 10, available: false },
        { hour: 11, available: true },
      ]),
    );
  });
});
