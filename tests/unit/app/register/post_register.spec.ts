import { faker } from '@faker-js/faker';
import postUsecase from  'src/app/register/post';

describe('App -> User -> Post', () => {
  const randomEmail = faker.internet.email();
  const randomUserName = faker.internet.userName();
  const randomPassword = faker.internet.password();
  let useCase: { register: any; };

  describe('Success path', () => {
    beforeEach(() => {
      const MockRepository = {
        register: (data: any) => data
      }

      useCase = postUsecase({
        usersRepository: MockRepository
      } as any)
    })

    it('test', async () => {
      const body = {
        email: randomEmail,
        username: randomUserName,
        password: randomPassword,
      }

      const lists = await useCase.register({ ...body });
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
        register: () => Promise.reject('Error')
      }

      useCase = postUsecase({
        usersRepository: MockRepository
      } as any)
    })

    it('should display error on rejection', async () => {

      let error
      try {
        await useCase.register({ ...body })
      } catch (e) {
        // error = e.message;
        error = e;
      }
      expect(error).toEqual('Error')
    })
  })

});
