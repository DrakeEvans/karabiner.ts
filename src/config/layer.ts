import {
  FromKeyCode,
  FromOnlyFunctionKeyCode,
  ModifierKeyCode,
  ToDisableKeyCode,
} from '../karabiner/key-code'
import { Manipulator, Rule, ToVariable } from '../karabiner/karabiner-config'
import { getKeyWithAlias, ModifierKeyAlias } from '../utils/key-alias'
import { FromKeyParam, map } from './from'
import { setVar } from './to'
import { ifVar } from './condition'
import { BasicRuleBuilder } from './rule'

type LayerExclude = FromOnlyFunctionKeyCode | ToDisableKeyCode | ModifierKeyCode
type LayerKeyCode = Exclude<FromKeyCode, LayerExclude>
type LayerKeyParam = Exclude<FromKeyParam, LayerExclude | ModifierKeyAlias>

/** @see https://github.com/yqrashawn/GokuRakuJoudo/blob/master/tutorial.md#advance3 */
export function layer(
  key: LayerKeyParam,
  varName: string,
  onValue: ToVariable['value'] = 1,
  offValue: ToVariable['value'] = 0,
) {
  return new LayerRuleBuilder(key, varName, onValue, offValue)
}

export class LayerRuleBuilder extends BasicRuleBuilder {
  protected readonly layerManipulator: Manipulator

  constructor(
    protected readonly key: LayerKeyParam,
    protected readonly varName: string,
    protected readonly onValue: ToVariable['value'] = 1,
    protected readonly offValue: ToVariable['value'] = 0,
  ) {
    super(`Layer - ${varName}`, ifVar(varName, onValue))

    const key_code = getKeyWithAlias(key) as LayerKeyCode
    this.layerManipulator = map(key_code)
      .toVar(varName, onValue)
      .toAfterKeyUp(setVar(varName, offValue))
      .toIfAlone({ key_code })
      .build()
  }

  public build(): Rule {
    const rule = super.build()
    rule.manipulators = [this.layerManipulator, ...rule.manipulators]
    return rule
  }
}

/** @see https://github.com/yqrashawn/GokuRakuJoudo/blob/master/tutorial.md#advance3 */
export function simlayer(
  key: LayerKeyParam,
  varName: string,
  threshold = 250,
  onValue: ToVariable['value'] = 1,
  offValue: ToVariable['value'] = 0,
) {
  return new SimlayerRuleBuilder(key, varName, threshold, onValue, offValue)
}

export class SimlayerRuleBuilder extends BasicRuleBuilder {
  constructor(
    protected readonly key: LayerKeyParam,
    protected readonly varName: string,
    protected readonly threshold = 250,
    protected readonly onValue: ToVariable['value'] = 1,
    protected readonly offValue: ToVariable['value'] = 0,
  ) {
    super(`Simlayer - ${varName}`, ifVar(varName, onValue))
  }

  public build(): Rule {
    const rule = super.build()

    const setVarOn = setVar(this.varName, this.onValue)
    const setVarOff = setVar(this.varName, this.offValue)
    const layerKey = getKeyWithAlias(this.key) as LayerKeyCode
    rule.manipulators.concat().forEach((v) => {
      if (v.type !== 'basic' || !v.to?.length) return // TODO Throw error
      const fromKey = (v.from as { key_code: FromKeyCode }).key_code
      if (!fromKey) return // TODO Throw error
      rule.manipulators.push({
        type: 'basic',
        parameters: {
          'basic.simultaneous_threshold_milliseconds': this.threshold,
        },
        to: [setVarOn, ...v.to],
        from: {
          simultaneous: [{ key_code: layerKey }, { key_code: fromKey }],
          simultaneous_options: {
            detect_key_down_uninterruptedly: true,
            key_down_order: 'strict',
            key_up_order: 'strict_inverse',
            key_up_when: 'any',
            to_after_key_up: [setVarOff],
          },
        },
      })
    })

    return rule
  }
}