import {
  BasicManipulator,
  BasicParameters,
  Condition,
  FromEvent,
  Manipulator,
  ToEvent,
  ToEventOptions,
  ToInputSource,
  ToMouseCursorPosition,
  ToMouseKey,
  ToVariable,
} from '../karabiner/karabiner-config'
import { ModifierParam } from './modifier'
import {
  to$,
  toApp,
  toCgEventDoubleClick,
  toConsumerKey,
  toHyper,
  toInputSource,
  toKey,
  ToKeyParam,
  toMeh,
  toMouseCursorPosition,
  toMouseKey,
  toNone,
  toNotificationMessage,
  toPaste,
  toPointingButton,
  toRemoveNotificationMessage,
  toSetVar,
  toSleepSystem,
  toStickyModifier,
  toSuperHyper,
} from './to'
import { buildCondition, ConditionBuilder } from './condition'
import { ToConsumerKeyCode } from '../karabiner/consumer-key-code'
import { PointingButton } from '../karabiner/pointing-button'
import { StickyModifierKeyCode } from '../karabiner/key-code'
import { toArray } from '../utils/to-array'
import { BuildContext } from '../utils/build-context'
import { toTypeSequence } from './to-type-sequence'

export interface ManipulatorBuilder {
  build(context?: BuildContext): Manipulator[]
}

export class BasicManipulatorBuilder implements ManipulatorBuilder {
  protected readonly manipulator: BasicManipulator

  constructor(from: FromEvent) {
    this.manipulator = { type: 'basic', from }
  }

  /** The FromEvent of the Manipulator. */
  get from(): FromEvent {
    return this.manipulator.from
  }
  /** Set or add ToEvent(s) to the Manipulator. */

  to(event: ToEvent | ToEvent[]): this
  /** Set or add a ToEvent with a key_code. */
  to(key: ToKeyParam, modifiers?: ModifierParam, options?: ToEventOptions): this
  to(
    keyOrEvent: ToEvent | ToKeyParam | ToEvent[],
    modifiers?: ModifierParam,
    options?: ToEventOptions,
  ): this {
    this.addToEvent(
      typeof keyOrEvent === 'object'
        ? keyOrEvent
        : toKey(keyOrEvent, modifiers, options),
    )
    return this
  }

  /** To Hyper key ⌘⌥⌃⇧ */
  toHyper(options?: ToEventOptions): this {
    this.addToEvent(toHyper(options))
    return this
  }

  /** To Meh key ⌥⌃⇧ */
  toMeh(options?: ToEventOptions): this {
    this.addToEvent(toMeh(options))
    return this
  }

  /** To SuperHyper key ⌘⌥⌃⇧fn */
  toSuperHyper(options?: ToEventOptions): this {
    this.addToEvent(toSuperHyper(options))
    return this
  }

  /** To vk_none (Disable this key) */
  toNone(options?: ToEventOptions): this {
    this.addToEvent(toNone(options))
    return this
  }

  /** To { consumer_key_code } */
  toConsumerKey(
    code: ToConsumerKeyCode,
    modifiers?: ModifierParam,
    options?: ToEventOptions,
  ): this {
    this.addToEvent(toConsumerKey(code, modifiers, options))
    return this
  }

  /** Map to mouse button */
  toPointingButton(
    button: PointingButton,
    modifiers?: ModifierParam,
    options?: ToEventOptions,
  ): this {
    this.addToEvent(toPointingButton(button, modifiers, options))
    return this
  }

  /** Map to shell command */
  to$(shell_command: string): this {
    this.addToEvent(to$(shell_command))
    return this
  }

  /** Map to `$ open -a {app}.app` */
  toApp(app: string): this {
    this.addToEvent(toApp(app))
    return this
  }

  /** Map to paste {text} via clipboard */
  toPaste(text: string): this {
    this.addToEvent(toPaste(text))
    return this
  }

  /** To change the current input source */
  toInputSource(inputSource: ToInputSource): this {
    this.addToEvent(toInputSource(inputSource))
    return this
  }

  /** Map to setting a variable */
  toVar(name: string, value: ToVariable['value'] = 1): this {
    this.addToEvent(toSetVar(name, value))
    return this
  }

  /** To set or remove (set text to '') the notification message */
  toNotificationMessage(id: string, text: string): this {
    this.addToEvent(toNotificationMessage(id, text))
    return this
  }

  /** To remove the notification message */
  toRemoveNotificationMessage(id: string): this {
    this.addToEvent(toRemoveNotificationMessage(id))
    return this
  }

  /** Move mouse cursor by delta */
  toMouseKey(mouse_key: ToMouseKey): this {
    this.addToEvent(toMouseKey(mouse_key))
    return this
  }

  /** Changes to a sticky modifier key */
  toStickyModifier(
    key: StickyModifierKeyCode,
    value: 'on' | 'off' | 'toggle' = 'toggle',
  ): this {
    this.addToEvent(toStickyModifier(key, value))
    return this
  }

  /** @see https://karabiner-elements.pqrs.org/docs/json/complex-modifications-manipulator-definition/to/software_function/cg_event_double_click/ */
  toCgEventDoubleClick(button: number): this {
    this.addToEvent(toCgEventDoubleClick(button))
    return this
  }

  /** Set mouse cursor position */
  toMouseCursorPosition(p: ToMouseCursorPosition): this {
    this.addToEvent(toMouseCursorPosition(p))
    return this
  }

  /** To causes a system sleep */
  toSleepSystem(delay?: number): this {
    this.addToEvent(toSleepSystem(delay))
    return this
  }

  /** To type a string of keys */
  toTypeSequence(src: string, map?: Record<string, ToEvent>): this {
    this.addToEvent(toTypeSequence(src, map))
    return this
  }

  toIfAlone(event: ToEvent | ToEvent[]): this
  toIfAlone(
    key: ToKeyParam,
    modifiers?: ModifierParam,
    options?: ToEventOptions,
  ): this
  toIfAlone(
    keyOrEvent: ToEvent | ToEvent[] | ToKeyParam,
    modifiers?: ModifierParam,
    options?: ToEventOptions,
  ): this {
    this.pushOrCreateList(
      this.manipulator,
      'to_if_alone',
      typeof keyOrEvent === 'object'
        ? keyOrEvent
        : toKey(keyOrEvent, modifiers, options),
    )
    return this
  }

  toIfHeldDown(event: ToEvent | ToEvent[]): this
  toIfHeldDown(
    key: ToKeyParam,
    modifiers?: ModifierParam,
    options?: ToEventOptions,
  ): this
  toIfHeldDown(
    keyOrEvent: ToEvent | ToEvent[] | ToKeyParam,
    modifiers?: ModifierParam,
    options?: ToEventOptions,
  ): this {
    this.pushOrCreateList(
      this.manipulator,
      'to_if_held_down',
      typeof keyOrEvent === 'object'
        ? keyOrEvent
        : toKey(keyOrEvent, modifiers, options),
    )
    return this
  }

  toAfterKeyUp(event: ToEvent | ToEvent[]): this
  toAfterKeyUp(
    key: ToKeyParam,
    modifiers?: ModifierParam,
    options?: ToEventOptions,
  ): this
  toAfterKeyUp(
    keyOrEvent: ToEvent | ToEvent[] | ToKeyParam,
    modifiers?: ModifierParam,
    options?: ToEventOptions,
  ): this {
    this.pushOrCreateList(
      this.manipulator,
      'to_after_key_up',
      typeof keyOrEvent === 'object'
        ? keyOrEvent
        : toKey(keyOrEvent, modifiers, options),
    )
    return this
  }

  toDelayedAction(
    ifInvoked: ToEvent | ToEvent[],
    ifCanceled: ToEvent | ToEvent[],
  ): this {
    const delayedAction = this.manipulator.to_delayed_action || {
      to_if_invoked: [],
      to_if_canceled: [],
    }
    toArray(ifInvoked).forEach((v) => delayedAction.to_if_invoked.push(v))
    toArray(ifCanceled).forEach((v) => delayedAction.to_if_canceled.push(v))
    this.manipulator.to_delayed_action = delayedAction
    return this
  }

  description(v: string): this {
    this.manipulator.description = v
    return this
  }

  condition(...v: Array<Condition | ConditionBuilder>): this {
    const { conditions = [] } = this.manipulator
    this.manipulator.conditions = [...conditions, ...v.map(buildCondition)]
    return this
  }

  parameters(v: BasicParameters): this {
    this.manipulator.parameters = { ...this.manipulator.parameters, ...v }
    return this
  }

  build(_?: BuildContext): BasicManipulator[] {
    return [{ ...this.manipulator }]
  }

  protected addToEvent(event: ToEvent | ToEvent[]) {
    this.pushOrCreateList(this.manipulator, 'to', event)
  }

  protected pushOrCreateList<TListHolder extends {}, TItem>(
    obj: TListHolder,
    key: keyof TListHolder,
    item: TItem | TItem[],
  ) {
    const list = (obj[key] || []) as TItem[]
    toArray(item).forEach((v) => list.push(v))
    Object.assign(obj, { [key]: list })
  }
}

export function isManipulatorBuilder(
  src: Manipulator | ManipulatorBuilder,
): src is ManipulatorBuilder {
  return typeof (src as ManipulatorBuilder).build === 'function'
}

export function buildManipulators(
  src: Manipulator | ManipulatorBuilder,
  context?: BuildContext,
): Manipulator[] {
  return isManipulatorBuilder(src) ? src.build(context) : [src]
}
