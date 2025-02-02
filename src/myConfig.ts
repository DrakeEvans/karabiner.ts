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
  layer('semicolon', 'semicolon-down')
    .modifiers({ optional: 'any' })
    .manipulators([
      withMapper({
        j: 'left_arrow',
        k: 'down_arrow',
        l: 'right_arrow',
        i: 'up_arrow',
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
        // right_shift: ['semicolon', 'shift'],
      })((k, v) =>
        map(k).to(v[0] as ToKeyParam, v[1] as ModifierParam | undefined),
      ),
    ]),
  layer('caps_lock', 'caps_lock-down')
  .configKey((v) => v.toIfAlone('vk_none'), true )
  .modifiers({ optional: 'any' })
    .manipulators([
      // caps_lock remap with shift
      withMapper({
        y: [6, 'shift'],
        u: [7, 'shift'],
        i: [8, 'shift'],
        o: [9, 'shift'],
        p: [0, 'shift'],
        j: ['open_bracket'],
        k: ['close_bracket'],
        l: ['backslash', 'shift'],
        spacebar: ['hyphen', 'shift'],
        quote: ['grave_accent_and_tilde'],
        slash: ['backslash'],
      } as Record<any, any>)((k, v) =>
        map(k as FromKeyParam).to(v[0] as ToKeyParam, v[1]),
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
  simlayer('f', 'f_down').manipulators([
    withMapper({
      j: ['delete_or_backspace'],
      k: ['delete_forward'],
    } as Record<any, any>)((k, v) =>
      map(k as FromKeyParam).to(v[0] as ToKeyParam, v[1]),
    ),
  ]),
  rule('Set slash as left shift').manipulators([
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
