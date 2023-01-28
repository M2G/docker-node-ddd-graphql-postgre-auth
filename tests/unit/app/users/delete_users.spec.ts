import { faker } from '@faker-js/faker';
import deleteUseCase from  'app/users/delete';

describe('App -> User -> Delete', () => {
  const randomUUID = faker.datatype.uuid();
  let useCase: { remove: ({ ...args }: any) => Promise<void> };
  const mockData = [{
    _id: randomUUID,
  }]

  describe('Success path', () => {
    beforeEach(() => {

      const MockRepository = {
        remove: () => mockData
      }


      useCase = deleteUseCase({
        usersRepository: MockRepository,
      })
    });

    it('should display the user on success', async () => {
      // @ts-ignore
      const user = await useCase.remove({ randomUUID });
      expect(user).toEqual(mockData);
    })
  });

  describe('Fail path', () => {
    beforeEach(() => {
      const MockRepository = {
        remove: () => Promise.reject('Error'),
      }

      useCase = deleteUseCase({
        usersRepository: MockRepository,
      })
    })

    it('should display error on rejection', async () => {

      let error;
      try {
        await useCase.remove({ randomUUID });
      } catch (e) {
        // error = e.message;
        error = e;
      }
      expect(error).toEqual('Error');
    })
  })

})
