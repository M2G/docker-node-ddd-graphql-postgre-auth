import { faker } from '@faker-js/faker';
import updateUsecase from  'src/app/users/put';

describe('App -> User -> Put', () => {
  const randomUUID = 1;
  const randomEmail = faker.internet.email();
  const randomUserName = faker.internet.userName();
  const randomPassword = faker.internet.password();
  let useCase: { update: any; };

  describe('Success path', () => {
    beforeEach(() => {
      const MockRepository = {
        update: (data: any) => data
      }

      useCase = updateUsecase({
        usersRepository: MockRepository
      } as any)
    })

    it('test', async () => {
      const body = {
        email: randomEmail,
        username: randomUserName,
        password: randomPassword,
      }

      const lists = await useCase.update({ id: randomUUID, ...body });
      expect(lists.email).toEqual(body.email);
      expect(lists.username).toEqual(body.username);
      expect(lists.password).toEqual(body.password);
    })
  })

  describe('Fail path', () => {
    const body = {
      email: randomEmail,
      username: randomUserName,
      password: randomPassword,
    }

    beforeEach(() => {
      const MockRepository = {
        update: () => Promise.reject('Error')
      }

      useCase = updateUsecase({
        usersRepository: MockRepository
      } as any)
    })

    it('should display error on rejection', async () => {

      let error
      try {
        await useCase.update({ id: randomUUID, ...body })
      } catch (e) {
        // error = e.message;
        error = e;
      }
      expect(error).toEqual('Error')
    })
  })

});

