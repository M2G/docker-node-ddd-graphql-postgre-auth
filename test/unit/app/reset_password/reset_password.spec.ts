import postUsecase from  '../../../../src/app/reset_password/post';
import { encryptPassword } from '../../../../src/infra/encryption';

describe('App -> User -> resetPassword', () => {
  let useCase: { resetPassword: any };
  const password = "test";
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAzOCwidXNlcm5hbWUiOiJ0ZXN0IiwicGFzc3dvcmQiOiIkMmIkMTAkL2QvdkhaeERKZjBLbldFTW9rZkJndURSdFl2Ty9JWng1eE1UZDYxclZvcTBvdHlTZktIdnUiLCJpYXQiOjE2Mjg0NTkwOTgsImV4cCI6MTYyODQ2MjY5OH0.xmLUD2OffHPU6aU0U2DBaSOLyJnAgBGit7k4S0uS5aE";
  const hashPassword = encryptPassword(password);


  describe('Success path', () => {
    beforeEach(() => {
      const MockRepository = {
        resetPassword: (data: any) => data
      }

      useCase = postUsecase({
        usersRepository: MockRepository
      })
    })

    it('test', async () => {
      const body = {
        password: hashPassword,
        token,
      }

      const lists = await useCase.resetPassword({ ...body });
      expect(lists.password).toEqual(body.password);
      expect(lists.token).toEqual(body.token);
    })
  })

  describe('Fail path', () => {
    const body = {
      password: hashPassword,
      token,
    }

    beforeEach(() => {
      const MockRepository = {
        resetPassword: () => Promise.reject('Error')
      }

      useCase = postUsecase({
        usersRepository: MockRepository
      })
    })

    it('should display error on rejection', async () => {

      let error;
      try {
        await useCase.resetPassword({ ...body })
      } catch (e) {

        console.log('e', e)

        //@ts-ignore
       // error = e.message
        error = e
      }
      expect(error).toEqual('Error')
    })
  })

})
