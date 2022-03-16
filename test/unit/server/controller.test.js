import { 
	jest,
	expect,
	describe,
	test,
	beforeEach
} from '@jest/globals'
import config from '../../../server/config'
import { Controller } from '../../../server/controller'
import { Service } from '../../../server/service'
import TestUtil from '../_util/testUtil'

const { pages } = config

describe('#Controller', () => {
  beforeEach(() => {
		jest.restoreAllMocks()
		jest.clearAllMocks()
	})

  test('Should return a stream and type', async () => {
    const controller = new Controller()
    const mockFileStream = TestUtil.generateReadableStream(['test'])
    const expectedType = '.html'

    const getFileStream = jest
      .spyOn(
        Service.prototype, Service.prototype.getFileStream.name
      ).mockResolvedValue({
        stream: mockFileStream,
        type: expectedType
      })

      const controllerResponse = await controller.getFileStream(pages.homeHTML)

      expect(getFileStream).toBeCalledWith(pages.homeHTML)
      expect(controllerResponse).toStrictEqual({
        stream: mockFileStream,
        type: expectedType
      })
  })
})