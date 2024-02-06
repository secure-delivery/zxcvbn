import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common/src'
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en/src'
import { ZxcvbnFactory } from '../../src'

describe('levenshtein', () => {
  const zxcvbn = new ZxcvbnFactory({
    dictionary: {
      ...zxcvbnCommonPackage.dictionary,
      ...zxcvbnEnPackage.dictionary,
    },
    graphs: zxcvbnCommonPackage.adjacencyGraphs,
    translations: zxcvbnEnPackage.translations,
    useLevenshteinDistance: true,
  })

  it('should find levensteindistance', () => {
    const result = zxcvbn.check('ishduehlduod83h4mfs8', [
      'ishduehgldueod83h4mfis8',
    ])
    expect(result.calcTime).toBeDefined()
    result.calcTime = 0
    expect(result).toEqual({
      calcTime: 0,
      crackTimesBase: {
        offlineFastHashingXPerSecond: null,
        offlineSlowHashingXPerSecond: null,
        onlineNoThrottlingXPerSecond: null,
        onlineThrottlingXPerHour: 1,
      },
      crackTimesDisplay: {
        offlineFastHashingXPerSecond: 'less than a second',
        offlineSlowHashingXPerSecond: 'less than a second',
        onlineNoThrottlingXPerSecond: 'less than a second',
        onlineThrottlingXPerHour: '1 minute',
      },
      crackTimesSeconds: {
        offlineFastHashingXPerSecond: 2e-10,
        offlineSlowHashingXPerSecond: 0.0002,
        onlineNoThrottlingXPerSecond: 0.2,
        onlineThrottlingXPerHour: 72,
      },
      feedback: {
        suggestions: ['Add more words that are less common.'],
        warning: 'There should not be any personal or page related data.',
      },
      guesses: 2,
      guessesLog10: 0.30102999566398114,
      password: 'ishduehlduod83h4mfs8',
      score: 0,
      sequence: [
        {
          baseGuesses: 1,
          dictionaryName: 'userInputs',
          guesses: 1,
          guessesLog10: 0,
          i: 0,
          j: 19,
          l33t: false,
          l33tVariations: 1,
          levenshteinDistance: 3,
          levenshteinDistanceEntry: 'ishduehgldueod83h4mfis8',
          matchedWord: 'ishduehlduod83h4mfs8',
          pattern: 'dictionary',
          rank: 1,
          reversed: false,
          token: 'ishduehlduod83h4mfs8',
          uppercaseVariations: 1,
        },
      ],
    })
  })

  it('should recognize a mistyped common English word', () => {
    const result = zxcvbn.check('alaphant')
    expect(result.calcTime).toBeDefined()
    result.calcTime = 0
    expect(
      result.sequence.find(
        (sequenceItem) => sequenceItem.levenshteinDistance !== undefined,
      ),
    ).toBeDefined()
    expect(result).toEqual({
      calcTime: 0,
      crackTimesBase: {
        offlineFastHashingXPerSecond: null,
        offlineSlowHashingXPerSecond: null,
        onlineNoThrottlingXPerSecond: 35,
        onlineThrottlingXPerHour: 3,
      },
      crackTimesDisplay: {
        offlineFastHashingXPerSecond: 'less than a second',
        offlineSlowHashingXPerSecond: 'less than a second',
        onlineNoThrottlingXPerSecond: '35 seconds',
        onlineThrottlingXPerHour: '3 hours',
      },
      crackTimesSeconds: {
        offlineFastHashingXPerSecond: 3.45e-8,
        offlineSlowHashingXPerSecond: 0.0345,
        onlineNoThrottlingXPerSecond: 34.5,
        onlineThrottlingXPerHour: 12420,
      },
      feedback: {
        suggestions: ['Add more words that are less common.'],
        warning: 'This is a commonly used password.',
      },
      guesses: 345,
      guessesLog10: 2.537819095073274,
      password: 'alaphant',
      score: 0,
      sequence: [
        {
          baseGuesses: 344,
          dictionaryName: 'passwords',
          guesses: 344,
          guessesLog10: 2.53655844257153,
          i: 0,
          j: 7,
          l33t: false,
          l33tVariations: 1,
          levenshteinDistance: 2,
          levenshteinDistanceEntry: 'elephant',
          matchedWord: 'alaphant',
          pattern: 'dictionary',
          rank: 344,
          reversed: false,
          token: 'alaphant',
          uppercaseVariations: 1,
        },
      ],
    })
  })

  it('should respect threshold which is lower than the default 2', () => {
    const customZxcvbn = new ZxcvbnFactory({
      dictionary: {
        ...zxcvbnCommonPackage.dictionary,
        ...zxcvbnEnPackage.dictionary,
      },
      graphs: zxcvbnCommonPackage.adjacencyGraphs,
      translations: zxcvbnEnPackage.translations,
      useLevenshteinDistance: true,
      levenshteinThreshold: 1,
    })
    const result = customZxcvbn.check('eeleephaant')
    expect(
      result.sequence.find(
        (sequenceItem) => sequenceItem.levenshteinDistance !== undefined,
      ),
    ).toBeUndefined()
  })

  it('should respect threshold which is higher than the default 2', () => {
    const customZxcvbn = new ZxcvbnFactory({
      dictionary: {
        ...zxcvbnCommonPackage.dictionary,
        ...zxcvbnEnPackage.dictionary,
      },
      graphs: zxcvbnCommonPackage.adjacencyGraphs,
      translations: zxcvbnEnPackage.translations,
      useLevenshteinDistance: true,
      levenshteinThreshold: 3,
    })
    const result = customZxcvbn.check('eeleephaant')
    expect(result.sequence.length).toStrictEqual(1)
    expect(result.sequence[0].levenshteinDistance).toBeDefined()
  })
})
