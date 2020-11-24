jest.setTimeout(60000)

import StoryblokClient from '../source/index'
import RichTextResolver from '../source/richTextResolver'

let Storyblok = new StoryblokClient({
  accessToken: 'trB5kgOeDD22QJQDdPNCjAtt',
  cache: { type: 'memory', clear: 'auto' }
})

describe('getAll function', () => {
  test('getAll(\'cdn/stories\') should return all stories', async () => {
    const result = await Storyblok.getAll('cdn/stories')
    expect(result.length).toBe(26)
  })

  test('getAll(\'cdn/stories\') should return all stories with filtered results', async () => {
    const result = await Storyblok.getAll('cdn/stories', {starts_with: 'testcontent-0'})
    expect(result.length).toBe(1)
  })

  test('getAll(\'cdn/links\') should return all links', async () => {
    const result = await Storyblok.getAll('cdn/links')
    expect(result.length).toBe(26)
  })

  if (process.env.OAUTH_TOKEN) {
    test('getAll(\'spaces/67647/stories\') should return all spaces', async () => {
      let StoryblokManagement = new StoryblokClient({
        oauthToken: process.env.OAUTH_TOKEN
      })
      const result = await StoryblokManagement.getAll('spaces/67647/stories')
      expect(result.length).toBe(26)
    })
  }
})

describe('test uncached requests', () => {
  test('get(\'cdn/spaces/me\') should not be cached', async () => {
    let provider = Storyblok.cacheProvider()
    provider.flush()
    const result = await Storyblok.get('cdn/spaces/me')
    expect(Object.values(provider.getAll()).length).toBe(0)
  })
})

describe('test cached requests', () => {
  test('get(\'cdn/stories\') should be cached when is a published version', async () => {
    const cacheVersion = Storyblok.cacheVersion()

    await Storyblok.get('cdn/stories')

    expect(cacheVersion).not.toBe(undefined)

    const newCacheVersion = Storyblok.cacheVersion()

    await Storyblok.get('cdn/stories')

    expect(newCacheVersion).toBe(Storyblok.cacheVersion())

    await Storyblok.get('cdn/stories')

    expect(newCacheVersion).toBe(Storyblok.cacheVersion())
  })
})

describe('test constructor', () => {
  it('should have a richtextResolver field that is an instance of RichTextResolver', () => {
    expect(Storyblok.richTextResolver).toBeInstanceOf(RichTextResolver)
  })
})
