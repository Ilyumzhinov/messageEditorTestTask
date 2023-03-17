import { Template, generate_message } from '../model/template';


// MARK: - Rain example
// MARK: Sunny=true
test('Rain example test of generate_message(): sunny=true', () => {
  const example: Template = [
    'It is ',
    [
      ['{sunny}'],
      ['{sunny}'],
      [
        'precipitating with ',
        [
          ['{rain}'],
          ['{rain}'],
          ['snow']
        ]
      ]
    ],
    ' today'
  ]
  const vars = {
    'sunny': 'Sunny',
    'rain': 'Light rain'
  }
  const result = 'It is Sunny today'

  expect(generate_message(example, vars)).toBe(result);
})


// MARK: Summy=false,rain=true
test('Rain example test of generate_message(): sunny=false, rain=true', () => {
  const example: Template = [
    'It is ',
    [
      ['{sunny}'],
      ['{sunny}'],
      [
        'precipitating with ',
        [
          ['{rain}'],
          ['{rain}'],
          ['snow']
        ]
      ]
    ],
    ' today'
  ]
  const vars = {
    'sunny1': 'Sunny',
    'rain': 'Light rain'
  }
  const result = 'It is precipitating with Light rain today'

  expect(generate_message(example, vars)).toBe(result);
})


// MARK: - Provided example
// MARK: Everything is filled out
test('Provided example test of generate_message(): everything is filled out', () => {
  const example: Template = [
    'Hello {firstname}!\n',
    [
      ['{company}'],
      [
        'I know you work at {company}',
        [
          ['{position}'],
          [' as {position}. '],
          [', but what is your role? ']
        ],
        ':)'
      ],
      ['Where do you work at the moment?']
    ],
    '\nJake'
  ]
  const vars = {
    'firstname': 'Bill',
    'lastname': 'Gates',
    'company': 'Gates Foundation',
    'position': 'Co-chair'
  }
  const result = 'Hello Bill!\nI know you work at Gates Foundation as Co-chair. :)\nJake'

  expect(generate_message(example, vars)).toBe(result);
})


// MARK: position is omitted
test('Provided example test of generate_message(): -position', () => {
  const example: Template = [
    'Hello {firstname}!\n',
    [
      ['{company}'],
      [
        'I know you work at {company}',
        [
          ['{position}'],
          [' as {position}. '],
          [', but what is your role? ']
        ],
        ':)'
      ],
      ['Where do you work at the moment?']
    ],
    '\nJake'
  ]
  const vars = {
    'firstname': 'Bill',
    'lastname': 'Gates',
    'company': 'Gates Foundation'
  }
  const result = 'Hello Bill!\nI know you work at Gates Foundation, but what is your role? :)\nJake'

  expect(generate_message(example, vars)).toBe(result);
})


// MARK: first,lastname only
test('Provided example test of generate_message(): -company, -position', () => {
  const example: Template = [
    'Hello {firstname}!\n',
    [
      ['{company}'],
      [
        'I know you work at {company}',
        [
          ['{position}'],
          [' as {position}. '],
          [', but what is your role? ']
        ],
        ':)'
      ],
      ['Where do you work at the moment?']
    ],
    '\nJake'
  ]
  const vars = {
    'firstname': 'Bill',
    'lastname': 'Gates'
  }
  const result = 'Hello Bill!\nWhere do you work at the moment?\nJake'

  expect(generate_message(example, vars)).toBe(result);
})


// MARK: Name is ommmited
test('Provided example test of generate_message(): -name, -company, -position', () => {
  const example: Template = [
    'Hello {firstname}!\n',
    [
      ['{company}'],
      [
        'I know you work at {company}',
        [
          ['{position}'],
          [' as {position}. '],
          [', but what is your role? ']
        ],
        ':)'
      ],
      ['Where do you work at the moment?']
    ],
    '\nJake'
  ]
  const vars = {
  }
  const result = 'Hello !\nWhere do you work at the moment?\nJake'

  expect(generate_message(example, vars)).toBe(result);
})


// MARK: Variables are empty
test('Provided example test of generate_message(): empty variables', () => {
  const example: Template = [
    'Hello {firstname}!\n',
    [
      ['{company}'],
      [
        'I know you work at {company}',
        [
          ['{position}'],
          [' as {position}. '],
          [', but what is your role? ']
        ],
        ':)'
      ],
      ['Where do you work at the moment?']
    ],
    '\nJake'
  ]
  const vars = {
    'firstname': '',
    'company': '',
    'position': '',
  }
  const result = 'Hello !\nWhere do you work at the moment?\nJake'

  expect(generate_message(example, vars)).toBe(result);
})


// MARK: Text as operator
test('Provided example test of generate_message(): Text as operator', () => {
  const example: Template = [
    '{test1}',
    '{test2}'
  ]
  const vars = {
    'test1': '{test2}',
    'test2': 'apple'
  }
  const result = '{test2}apple'

  expect(generate_message(example, vars)).toBe(result);
})