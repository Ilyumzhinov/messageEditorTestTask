// MARK: Genertic types
export type IfBlock = [Template, Template, Template]
export type TemplateElement = string | IfBlock
/** Тип шаблона. Массив содержит либо строку либо массив из трёх элементов этого типа, представляющих блок If, Then, Else */
export type Template = TemplateElement[]


// MARK: Functions
/** Заменяет переменную в строке на её значение */
const replaceVars = (str: string, variables: { [key: string]: string }): string =>
    (str.at(0) === '{' && str.at(-1) === '}') ?
        variables[str.slice(1, -1)] :
        str

/** Находит часть строки в зависимости от условий IfBlock путём рекурсивного прохода по массиву.
 * 
 * Time Complexity: O(n log n)
 */
function flat_ifBlocks([block, ...template]: Template, variables: { [key: string]: string }, temp: Array<string> = []): Array<string> {
    if (block === undefined)
        return temp

    if (typeof block === 'string') {
        temp.push(block)
        return flat_ifBlocks(template, variables, temp)
    }

    const [ifb, thenb, elseb] = block

    const strIf = generate_message(ifb, variables)

    const strTemp = (strIf !== '') ?
        flat_ifBlocks(thenb, variables, temp) :
        flat_ifBlocks(elseb, variables, temp)

    return flat_ifBlocks(template, variables, strTemp)
}


// MARK: Generate message
/** Создаёт текст сообщения из Template.
 * 1. Найти часть строки в зависимости от условий IfBlock
 * 2. Разделить строку, содержащую скобки, на отдельные подстроки
 * 3. Заменить строки, содержащие переменные, на их значения
 * 4. Совместить строку
 * 
 * Пример:
 * 1. ['str1', ['{true}', '{var1}{var2}', 'els' ], 'str2'] -> ['str1', '{var1}{var2}', 'str2']
 * 2. ['str1', '{var1}{var2}', 'str2'] -> ['str1', ['{var1}', '{var2}'], 'str2'] -> ['str1', '{var1}', '{var2}', 'str2'
 * 3. ['str1', '{var1}', '{var2}', 'str2'] -> ['str1', 'val1', 'val2', 'str2']
 * 4. ['str1', 'val1', 'val2', 'str2'] -> 'str1val1val2str2'
 * 
 * Time Complexity: O(n log n)
 */
export function generate_message(template: Template, variables: { [key: string]: string }): string {
    return flat_ifBlocks(template, variables)
        .flatMap(str => str.split(/({[^}]+?})/g).filter(str => str !== ''))
        .map(str => replaceVars(str, variables))
        .join('')
}
