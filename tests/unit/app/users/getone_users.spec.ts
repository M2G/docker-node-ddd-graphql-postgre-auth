import getOneUseCase from  'src/app/users/getOne';
import IUser from '../../../../src/core/IUser';

describe('App -> User -> Get One', () => {
  const randomUUID = 1;
  let useCase: { getOne: ({ id }: { readonly id: number }) => IUser };
  const mockData = [{
    id: randomUUID,
  }]

  describe('Success path', () => {
    beforeEach(() => {

      const MockRepository = {
        findOne: () => mockData
      }

      useCase = getOneUseCase({
        usersRepository: MockRepository,
      } as any)
    });

    it('should display the user on success', async () => {
      // @ts-ignore
      const user = await useCase.getOne({ id: randomUUID });
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
      } as any)
    })

    it('should display error on rejection', async () => {

      let error;
      try {
        await useCase.getOne({ id: randomUUID });
      } catch (e) {
        // error = e.message;
        error = e;
      }
      expect(error).toEqual('Error');
    })
  })

});

