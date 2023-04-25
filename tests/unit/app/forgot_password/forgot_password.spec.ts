import { faker } from '@faker-js/faker';
import postUsecase from  'src/app/forgot_password/post';

describe('App -> User -> forgotPassword', () => {
  const randomEmail = faker.internet.email();
  let useCase: { forgotPassword: any };

  describe('Success path', () => {
    beforeEach(() => {
      const MockRepository = {
        forgotPassword: (data: any) => data
      }

      useCase = postUsecase({
        usersRepository: MockRepository
      } as any)
    })

    it('test', async () => {
      const body = {
        email: randomEmail,
      }

      const lists = await useCase.forgotPassword({ ...body });
      expect(lists.email).toEqual(body.email);
    })
  })

  describe('Fail path', () => {
    const body = {
      email: randomEmail,
    }

    beforeEach(() => {
      const MockRepository = {
        forgotPassword: () => Promise.reject('Error')
      }

      useCase = postUsecase({
        usersRepository: MockRepository
      } as any)
    })

    it('should display error on rejection', async () => {

      let error
      try {
        await useCase.forgotPassword({ ...body });
      } catch (e) {
        //@ts-ignore
        // error = e.message
        error = e;
      }
      expect(error).toEqual('Error')
    })
  })

})

