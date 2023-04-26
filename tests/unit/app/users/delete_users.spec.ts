import deleteUseCase from  'app/users/delete';
import IUser from '../../../../src/core/IUser';

describe('App -> User -> Delete', () => {
  const randomUUID = 1;
  let useCase: { remove: ({ id }: { readonly id: number }) => IUser };
  const mockData = [{
    id: randomUUID,
  }]

  describe('Success path', () => {
    beforeEach(() => {

      const MockRepository = {
        remove: () => mockData
      }


      useCase = deleteUseCase({
        usersRepository: MockRepository,
      } as any)
    });

    it('should display the user on success', async () => {
      // @ts-ignore
      const user = await useCase.remove({ id: randomUUID });
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
      } as any)
    })

    it('should display error on rejection', async () => {

      let error;
      try {
        await useCase.remove({ id: randomUUID });
      } catch (e) {
        // error = e.message;
        error = e;
      }
      expect(error).toEqual('Error');
    })
  })

})
