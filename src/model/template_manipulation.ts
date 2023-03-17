const structuredClone = (x: any) => JSON.parse(JSON.stringify(x))


/** Объединяет последовательные строковые элементы массива в один элемент, не строковые элементы оставляет без изменений. Возвращает новый массив.
 * Time Complexity: O(n) */
function repair_message<T>(xs: Array<string | T>): Array<string | T> {
    /** Time Complexity: O(1) */
    const repair = ({ accum, isPrevStr }: { accum: Array<(string | T)>, isPrevStr: boolean }, x: string | T) => {
        if (typeof x === 'string') {
            if (isPrevStr) {
                const last = accum.pop() + x
                accum.push(last)
            }
            else {
                accum.push(x)
            }

            return { accum: accum, isPrevStr: true }
        }

        accum.push(x)
        return { accum: accum, isPrevStr: false }
    }

    return xs.reduce(repair, { accum: [], isPrevStr: false }).accum
}

/** Изменяет элемент n уровней вглубь. Выполняет изменения над старым массивом, но производит shallow копирование массива.
 * Time Complexity: O(n)
 */
export function changeDeep<T, V>(xs: Array<T | V>, [i, ...is]: number[], x_new: T | V, xs_i: Array<T | V> = xs): Array<T | V> {
    if (is.length === 0) {
        xs_i[i] = x_new
        return [...xs]
    }

    return changeDeep(xs, is, x_new, xs_i[i] as Array<T | V>)
}

/** Удаляет элемент n уровней вглубь. Выполняет изменения над старым массивом, но производит shallow копирование массива.
 * Time Complexity: O(n)
 */
export function deleteDeep<T, V>(xs: Array<T | V>, [i, ...is]: number[], xs_i: Array<T | V> = xs): Array<T | V> {
    if (is.length === 0) {
        xs_i.splice(i, 1)
        return [...xs]
    }

    return deleteDeep(xs, is, xs_i[i] as Array<T | V>)
}

/** Удаляет элемент n уровней вглубь и соединяет последовательные строковые элемент, если таковые есть. Возвращает новый массив.
 * 
 * Time Complexity: O(n^2)
 */
export function deleteRepairDeep<T>(xs: Array<string | T>, is: number[]): Array<string | T> {
    const xs_is: Array<string | T>[] = is.reduce((accum, i) => {
        accum.push(accum.at(-1)[i])
        return accum
    },
        [structuredClone(xs)])

    const [xs_last, i_last] = [xs_is.at(-2)!, is.at(-1)!]
    xs_last.splice(i_last, 1)
    xs_last.splice(0, xs_last.length, ...repair_message(xs_last))

    return xs_is[0]
}

/** Вставляет строку к строковый элемент n уровней вглубь. Возвращает новый массив.
 * Time Complexity: O(n^2)
 */
export function insertDeep<T, V>(xs: Array<T | V>, is: number[], caretLocation: number, x_new: T | V): Array<T | V> {
    const xs_is = is.reduce((accum, i) => {
        accum.push(accum.at(-1)[i])
        return accum
    },
        [structuredClone(xs)])

    const last = xs_is.at(-1)

    const [last_start, last_end] = [last.slice(0, caretLocation), last.slice(caretLocation)]
    const [xs_last, i_last] = [xs_is.at(-2), is.at(-1)!]

    xs_last[i_last] = [last_start, x_new, last_end].join('')

    return xs_is[0]
}

/** Вставляет элемент n уровней вглубь путём разделения текущего элемента на 2 и вкрапления нового элемента между. Возвращает новый массив.
 * Time Complexity: O(n^2)
 */
export function insertSplitDeep<T, V>(xs: Array<T | V>, is: number[], caretLocation: number, x_new: T | V): Array<T | V> {
    const xs_is = is.reduce((accum, i) => {
        accum.push(accum.at(-1)[i])
        return accum
    },
        [structuredClone(xs)])

    const last = xs_is.at(-1)

    const [last_start, last_end] = [last.slice(0, caretLocation), last.slice(caretLocation)]
    const [xs_last, i_last] = [xs_is.at(-2), is.at(-1)]

    xs_last.splice(i_last, 1)

    const xs_new = [last_start, x_new, last_end].filter(xs => xs.length !== 0)

    xs_last.splice(i_last, 0, ...xs_new)

    return xs_is[0]
}