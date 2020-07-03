import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';

import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailability: ListProviderMonthAvailabilityService;

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list a provider`s month availability', async () => {
    const provider_id = 'Provider1';

    await fakeAppointmentsRepository.create({
      provider_id,
      date: new Date(2020, 3, 19, 8, 0, 0), // 10/Apr/2020
    });

    const allDayAppointmentsArray = Array.from(Array(10), (_, index) =>
      fakeAppointmentsRepository.create({
        provider_id,
        date: new Date(2020, 4, 20, index + 8, 0, 0),
      }),
    );

    await Promise.all(allDayAppointmentsArray);

    await fakeAppointmentsRepository.create({
      provider_id,
      date: new Date(2020, 4, 21, 8, 0, 0), // 11/May/2020
    });

    const availability = await listProviderMonthAvailability.execute({
      provider_id,
      month: 5, // May/2020
      year: 2020,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 19, available: true },
        { day: 20, available: false },
        { day: 21, available: true },
        { day: 22, available: true },
      ]),
    );
  });
});
