import { 
	jest,
	expect,
	describe,
	test,
	beforeEach
} from '@jest/globals'

import fs from 'fs'
import fsPromises from 'fs/promises'

import { Service } from '../../../server/service.js'
import TestUtil from '../_util/testUtil.js'
import config from '../../../server/config.js'

const {
  dir: {
    publicDirectory
  }
} = config

describe('#Controller', () => {
  beforeEach(() => {
		jest.restoreAllMocks()
		jest.clearAllMocks()
	})

  test('#createFileStream', () => {
    const mockFileStream = TestUtil.generateReadableStream(['data'])

    jest.spyOn(
      fs,
      fs.createReadStream.name
    ).mockReturnValue(mockFileStream)

    const service = new Service()
    const mockFile = 'file.mp3'
    const result = service.createFileStream(mockFile)

    expect(fs.createReadStream).toHaveBeenCalledWith(mockFile)
    expect(result).toStrictEqual(mockFileStream)
  })

  test('#getFileInfo', async () => {
    const service = new Service()
    const mockSong = 'song.mp3'

    jest.spyOn(
      fsPromises,
      fsPromises.access.name
    ).mockResolvedValue()

    const result = await service.getFileInfo(mockSong)

    const expectedResult = {
      type: '.mp3',
      name: `${publicDirectory}/${mockSong}`
    }
    
    expect(result).toStrictEqual(expectedResult)
  })

  test('#getFileStream', async () => {
    const mockFileStream = TestUtil.generateReadableStream(['data'])
    const mockSong = 'song.mp3'
    const mockSongPath = `${publicDirectory}/${mockSong}`

    const fileInfo = {
      type: '.mp3',
      name: mockSongPath
    }

    const service = new Service()

    jest.spyOn(
      service,
      service.getFileInfo.name
    ).mockResolvedValue(fileInfo)

    jest.spyOn(
      service,
      service.createFileStream.name
    ).mockReturnValue(mockFileStream)

    const result = await service.getFileStream(mockSong)

    expect(service.getFileInfo).toBeCalledWith(mockSong)
    expect(service.createFileStream).toBeCalledWith(mockSongPath)
    expect(result).toStrictEqual({
      stream: mockFileStream,
      type: fileInfo.type
    })
  })
})