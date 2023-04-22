import { expect, test } from 'vitest'
import { BasicRuleBuilder, isRuleBuilder, rule } from './rule.ts'
import { ifVar } from './condition.ts'
import { map } from './from.ts'

test('rule()', () => {
  const condition1 = ifVar('v1').build()
  const condition2 = ifVar('v2').build()
  const condition3 = ifVar('v3').build()
  const manipulator1 = map('a').to('b').build()
  const manipulator2 = map('c').to('d').condition(condition3).build()
  expect(
    rule('test', condition1)
      .condition(condition2)
      .manipulators([manipulator1, manipulator2])
      .build(),
  ).toEqual({
    description: 'test',
    manipulators: [
      { ...manipulator1, conditions: [condition1, condition2] },
      { ...manipulator2, conditions: [condition3, condition1, condition2] },
    ],
  })
})

test('isRuleBuilder()', () => {
  expect(isRuleBuilder({ description: 'a', manipulators: [] })).toBe(false)
  expect(isRuleBuilder(new BasicRuleBuilder('b'))).toBe(true)
})