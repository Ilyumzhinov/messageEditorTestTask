import { Template } from '../model/template';
import { changeDeep, deleteDeep, deleteRepairDeep, insertDeep, insertSplitDeep } from '../model/template_manipulation';


// MARK: - Change tests
// Deep change
test('Tests changeDeep() deep change', () => {
    const example = [1, [10, 20, [300, 400]], 2],
        example_is = [1, 1],
        example_new = 3

    const result = [1, [10, 3, [300, 400]], 2]

    expect(changeDeep(example, example_is, example_new)).toStrictEqual(result);
})
// Top change
test('Tests changeDeep() top change', () => {
    const example = [1, [10, 20, [300, 400]], 2],
        example_is = [0],
        example_new = 3

    const result = [3, [10, 20, [300, 400]], 2]

    expect(changeDeep(example, example_is, example_new)).toStrictEqual(result);
})


// MARK: - Delete tests
// Deep delete
test('Tests deleteDeep() deep delete', () => {
    const example = [1, [10, 20, [300, 400]], 2],
        example_is = [1, 2, 0]

    const result = [1, [10, 20, [400]], 2]

    expect(deleteDeep(example, example_is)).toStrictEqual(result);
})
// Top delete
test('Tests deleteDeep() top delete', () => {
    const example = [1, [10, 20, [300, 400]], 2],
        example_is = [1]

    const result = [1, 2]

    expect(deleteDeep(example, example_is)).toStrictEqual(result);
})


// MARK: - Delete and repair tests
// Deep repair
test('Tests deleteRepairDeep() deep delete', () => {
    const example = ['a', ['10', '20', '30'], 'b', 'c'],
        example_is = [1, 1]

    const result = ['a', ['1030'], 'b', 'c']

    expect(deleteRepairDeep(example, example_is)).toStrictEqual(result);
})
// Top repair
test('Tests deleteRepairDeep() top delete', () => {
    const example = ['1', ['10', '20', ['300', '400']], '2'],
        example_is = [1]

    const result = ['12']

    expect(deleteRepairDeep(example, example_is)).toStrictEqual(result);
})


// MARK: - Insert tests
// Deep insert
test('Tests insertDeep() deep insert', () => {
    const example = ['abc', ['10', '20', '30'], 'b', 'c'],
        is = [1, 1],
        caret = 1,
        x_new = 'XXX'


    const result = ['abc', ['10', '2XXX0', '30'], 'b', 'c']

    expect(insertDeep(example, is, caret, x_new)).toStrictEqual(result);
})
// Top insert
test('Tests insertDeep() top insert', () => {
    const example = ['abc', 'def', 'ghi'],
        is = [1],
        caret = 2,
        x_new = 'XXX'


    const result = ['abc', 'deXXXf', 'ghi']

    expect(insertDeep(example, is, caret, x_new)).toStrictEqual(result);
})


// MARK: - Insert split tests
// Deep insert
test('Tests insertSplitDeep() deep insert', () => {
    const example = ['abc', ['10', '20', '30'], 'b', 'c'],
        is = [1, 1],
        caret = 1,
        x_new = 'XXX'


    const result = ['abc', ['10', '2', 'XXX', '0', '30'], 'b', 'c']

    expect(insertSplitDeep(example, is, caret, x_new)).toStrictEqual(result);
})
// Top insert
test('Tests insertSplitDeep() top insert', () => {
    const example = ['abc', 'def', 'ghi'],
        is = [1],
        caret = 2,
        x_new = 'XXX'


    const result = ['abc', 'de', 'XXX', 'f', 'ghi']

    expect(insertSplitDeep(example, is, caret, x_new)).toStrictEqual(result);
})


// MARK: Tests with Template model
// Deep change
test('Tests changeDeep() with Template', () => {
    const example: Template = [
        'Hello {firstname}!\n',
        [
            ['{company}'],
            [
                'I know you work at {company}',
                [
                    ['{position}'],
                    [' as {position}. '],
                    [', but what is your role?']
                ],
                ':)'
            ],
            ['Where do you work at the moment?']
        ],
        '\nJake'
    ],
        example_is = [1, 1, 2],
        example_new = ':p'

    const result: Template = [
        'Hello {firstname}!\n',
        [
            ['{company}'],
            [
                'I know you work at {company}',
                [
                    ['{position}'],
                    [' as {position}. '],
                    [', but what is your role?']
                ],
                ':p'
            ],
            ['Where do you work at the moment?']
        ],
        '\nJake'
    ]
    const my: Template = changeDeep(example, example_is, example_new)
    expect(changeDeep(example, example_is, example_new)).toStrictEqual(result);
})
// Deep delete
test('Tests deleteDeep() with Template', () => {
    const example: Template = [
        'Hello {firstname}!\n',
        [
            ['{company}'],
            [
                'I know you work at {company}',
                [
                    ['{position}'],
                    [' as {position}. '],
                    [', but what is your role?']
                ],
                ':)'
            ],
            ['Where do you work at the moment?']
        ],
        '\nJake'
    ],
        example_is = [1, 1, 1]

    const result: Template = [
        'Hello {firstname}!\n',
        [
            ['{company}'],
            [
                'I know you work at {company}',
                ':)'
            ],
            ['Where do you work at the moment?']
        ],
        '\nJake'
    ]

    expect(deleteDeep(example, example_is)).toStrictEqual(result);
})
// Delete repair
test('Tests deleteRepair() with Template', () => {
    const example: Template = [
        'Hello {firstname}!\n',
        [
            ['{company}'],
            [
                'I know you work at {company}',
                [
                    ['{position}'],
                    [' as {position}. '],
                    [', but what is your role?']
                ],
                ':)'
            ],
            ['Where do you work at the moment?']
        ],
        '\nJake'
    ],
        example_is = [1, 1, 1]

    const result: Template = [
        'Hello {firstname}!\n',
        [
            ['{company}'],
            [
                'I know you work at {company}:)'
            ],
            ['Where do you work at the moment?']
        ],
        '\nJake'
    ]

    expect(deleteRepairDeep(example, example_is)).toStrictEqual(result);
})