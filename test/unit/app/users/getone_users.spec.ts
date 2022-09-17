import faker from 'faker';
import getOneUseCase from  '../../../../src/app/users/getOne';

describe('App -> User -> Get One', () => {
  const randomUUID = faker.datatype.uuid();
  let useCase: { getOne: ({ ...args }: any) => Promise<void> };
  const mockData = [{
    _id: randomUUID,
  }]

  describe('Success path', () => {
    beforeEach(() => {

      const MockRepository = {
        findOne: () => mockData
      }


      useCase = getOneUseCase({
        usersRepository: MockRepository,
      })
    });

    it('should display the user on success', async () => {
      // @ts-ignore
      const user = await useCase.getOne({ randomUUID });
      expect(user).toEqual(mockData);
    })
  });

  describe('Fail path', () => {
    beforeEach(() => {
      const MockRepository = {
        findOne: () => Promise.reject('Error'),
      }

      useCase = getOneUseCase({
        usersRepository: MockRepository,
      })
    })

    it('should display error on rejection', async () => {

      let error;
      try {
        await useCase.getOne({ randomUUID });
      } catch (e) {
        // error = e.message;
        error = e;
      }
      expect(error).toEqual('Error');
    })
  })

})
