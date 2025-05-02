import { Either, left, right } from './either'

function doSomething(x: boolean): Either<string, number> {
  if (x) {
    return right(10)
  } else {
    return left('error')
  }
}

test('sucess result', () => {
  const result = doSomething(true)

  expect(result.isRight()).toEqual(true)
  expect(result.isLeft()).toEqual(false)
})

test('error result', () => {
  const result = doSomething(false)

  expect(result.isRight()).toEqual(false)
  expect(result.isLeft()).toEqual(true)
})
