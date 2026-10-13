import {
  layer,
  map,
  NumberKeyValue,
  rule,
  withMapper,
  writeToProfile,
  ToKeyCode,
  ToKeyParam,
  FromKeyParam,
  simlayer,
  duoLayer,
  withModifier,
  Modifier,
  ModifierParam,
  mapSimultaneous,
  mapDoubleTap,
  ifVar,
} from './index'

// ! Change '--dry-run' to your Karabiner-Elements Profile name.
// (--dry-run print the config json into console)
// + Create a new profile if needed.
writeToProfile('drake2', [
  // writeToProfile('--dry-run', [
  // It is not required, but recommended to put symbol alias to layers,
  // (If you type fast, use simlayer instead, see https://evan-liu.github.io/karabiner.ts/rules/simlayer)
  // to make it easier to write '←' instead of 'left_arrow'.
  // Supported alias: https://github.com/evan-liu/karabiner.ts/blob/main/src/utils/key-alias.ts
  // layer('/', 'symbol-mode').manipulators([

  //   //     / + [ 1    2    3    4    5 ] =>

  layer('caps_lock', 'caps_lock-down')
  .configKey((v) => v.toIfAlone('vk_none'), true )
  .modifiers({ optional: 'any' })
    .manipulators([
      // caps_lock remap with shift
      withMapper({
        y: [6, 'shift'],
        u: [7, 'shift'],
        i: [8, 'shift'],
        o: ['backslash', 'shift'],
        p: [0, 'shift'],
        j: ['open_bracket'],
        k: ['close_bracket'],
        spacebar: ['hyphen', 'shift'],
        quote: ['grave_accent_and_tilde'],
        slash: ['backslash'],
      } as Record<any, any>)((k, v) =>
        map(k as FromKeyParam).to(v[0] as ToKeyParam, v[1]),
      ),
      // caps_lock + ; toggles numpad mode
      map('semicolon')
        .condition(ifVar('numpad-mode', 1))
        .toVar('numpad-mode', 0)
        .toRemoveNotificationMessage('numpad-mode'),
      map('semicolon')
        .condition(ifVar('numpad-mode', 1).unless())
        .toVar('numpad-mode', 1)
        .toNotificationMessage('numpad-mode', 'Numpad mode'),
      map('return_or_enter').to('return_or_enter', [
        'control',
        'command',
        'option',
        'shift',
      ]),
    ]),
      layer('semicolon', 'semicolon-down')
    .modifiers({ optional: 'any' })
    .manipulators([
      withMapper({
        h: 'left_arrow',
        j: 'down_arrow',
        k: 'up_arrow',
        l: 'right_arrow',
        spacebar: 'hyphen',
      })((k, v) => map(k).to(v as ToKeyCode)),
      withMapper({
        q: [1, 'shift'],
        w: [2, 'shift'],
        e: [3, 'shift'],
        r: [4, 'shift'],
        t: [5, 'shift'],
        a: [9, 'shift'],
        s: [0, 'shift'],
        d: ['open_bracket', 'shift'],
        f: ['close_bracket', 'shift'],
        tab: ['escape'],
        caps_lock: ['caps_lock'],
        c: ['grave_accent_and_tilde', 'shift'],
      })((k, v) =>
        map(k).to(v[0] as ToKeyParam, v[1] as ModifierParam | undefined),
      ),
    ]),
  layer('tab', 'tab_down')
    .configKey((v) => v.toIfHeldDown('vk_none', null, { hold_down_milliseconds: 1 }))  
    .manipulators([
      withMapper({
        h: ['backslash'],
        j: ['open_bracket'],
        k: ['close_bracket'],
        l: ['backslash', 'shift'],
        u: ['comma', 'shift'],
        i: ['period', 'shift'],
        o: ['slash', 'shift'],
        quote: ['grave_accent_and_tilde', 'shift'],
      } as Record<any, any>)((k, v) =>
        map(k as FromKeyParam).to(v[0] as ToKeyParam, v[1]),
      ),
    ]),
  rule('numpad mode', ifVar('numpad-mode', 1)).manipulators([
    withMapper({
      q: 1,
      w: 2,
      e: 3,
      r: 4,
      t: 5,
      y: 6,
      u: 7,
      i: 8,
      o: 9,
      p: 0,
      j: 4,
      k: 5,
      l: 6,
      m: 1,
      comma: 2,
      period: 3,
      spacebar: 0,
    } as Record<any, any>)((k, v) =>
      map(k as FromKeyParam).to(v as ToKeyParam),
    ),
  ]),
  simlayer('f', 'f_down').manipulators([
    withMapper({
      h: ['delete_or_backspace'],
      l: ['delete_forward'],
    } as Record<any, any>)((k, v) =>
      map(k as FromKeyParam).to(v[0] as ToKeyParam, v[1]),
    ),
  ]),
  rule('jk as equal_sign').manipulators([
    // config key mappings
    // map('slash').to('right_shift').toIfAlone('slash'),
    mapSimultaneous(
      ['j', 'k'],
      {
        detect_key_down_uninterruptedly: false,
        key_down_order: 'insensitive',
        key_up_order: 'insensitive',
        key_up_when: 'any',
      },
      200,
    )
      .modifiers('??')
      .to('equal_sign'),


    mapSimultaneous(
      ['j', 'l'],
      {
        detect_key_down_uninterruptedly: false,
        key_down_order: 'insensitive',
        key_up_order: 'insensitive',
        key_up_when: 'any',
      },
      200,
    )
      .modifiers('??')
      .to('equal_sign', 'shift'),
      // mapDoubleTap('left_shift').to('caps_lock'),
    ]),
], {
  'basic.to_if_alone_timeout_milliseconds': 300
})
