import { faker } from '@faker-js/faker';
import postUsecase from  'src/app/authenticate/post';

describe('App -> User -> Post', () => {
  const randomEmail = faker.internet.email();

  let useCase: { authenticate: any; };

  describe('Success path', () => {
    beforeEach(() => {
      const MockRepository: any = {
        authenticate: (data: any) => data
      }

      const MockRedis: any  = {
        set: () => (data: any) => data
      }

      useCase = postUsecase({
        usersRepository: MockRepository,
        redis: MockRedis
      })
    })

    it('test', async () => {
     const body = {
        email: randomEmail,
      }

      const lists = await useCase.authenticate({ ...body })
      const { email } = lists;
      expect(email).toEqual(body.email)
    })
  })

  describe('Fail path', () => {
    const body = {
      email: randomEmail,
    }

    beforeEach(() => {
      const MockRepository: any = {
        authenticate: () => Promise.reject('Error')
      }

      const MockRedis: any  = {
        set: () => (data: any) => data
      }

      useCase = postUsecase({
        usersRepository: MockRepository,
        redis: MockRedis
      } as any)
    })

    it('should display error on rejection', async () => {

      let error: any;
      try {
        await useCase.authenticate({ ...body })
      } catch (e: any) {
        error = e.message
      }
      expect(error).toEqual('Error');
    })
  })

})

