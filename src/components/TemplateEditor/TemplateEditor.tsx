import { useRef, useState } from 'react'
import { changeDeep, deleteRepairDeep, insertDeep, insertSplitDeep } from '../../model/template_manipulation'
import { Template } from '../../model/template'
import styles from './styles.module.css'
import { TemplatePreview } from '../TemplatePreview/TemplatePreview'
import { Modal } from '../Modal/Modal'

type HandleInputFunc = (ids: number[], caretLocation?: number) => void


// MARK: Template Editor
/** Позволяет редактировать шаблон сообщения */
export const TemplateEditor = ({ arrVarNames, template, callbackSave, setModalActive }: { arrVarNames: string[], template: Template | null, callbackSave: (value: Template) => void, setModalActive: React.Dispatch<React.SetStateAction<boolean>> }): JSX.Element => {
    const [temp, setTemplate] = useState(template !== null ? [...template] : [''])
    const [location, setLocation] = useState({ ids: [0], caretLocation: 0 })

    const [isPreviewActive, setPreviewActive] = useState(false)

    /** Следит за последней строкой ввода, которая была изменена и позицией курсора внутри строки */
    const handleInput: HandleInputFunc = (ids: number[], caretLocation?: number) => {
        if (caretLocation !== undefined)
            setLocation({ ids: ids, caretLocation: caretLocation })
    }
    /** Производит ввод даных в структуру Template при измении строки ввода */
    const handleInsert = (value: string) => {
        setTemplate(prevValue =>
            insertDeep(prevValue, location.ids, location.caretLocation, value)
        )
    }
    /** Производит ввод даных в структуру Template добавлении If блока */
    const handleInsertSplit = () => {
        setTemplate(prevValue =>
            insertSplitDeep(prevValue, location.ids, location.caretLocation, [[''], [''], ['']])
        )
    }

    return <div className={styles.templateEditor}>
        <h5>Message Template Editor</h5>
        <VarButtons arrVarNames={arrVarNames} handleInsert={handleInsert} />
        <button onClick={handleInsertSplit} className={styles.addButton}>
            <b>Click to add</b> : <span className={styles.ifLabel}>IF</span> [{"{some_variable}"}] <span className={styles.ifLabel}>THEN</span> [then_value] <span className={styles.ifLabel}>ELSE</span> [else_value]
        </button>
        <section className={styles.editor}>
            <TemplateBlock template={temp} setTemplate={setTemplate} handleInput={handleInput} ids={[0]} />
        </section>
        <section className={styles.modalButtons}>
            <button onClick={() => setPreviewActive(true)} className={styles.modalButton}>Preview</button>
            <button onClick={() => callbackSave(temp)} className={styles.modalButton}>Save</button>
            <button onClick={() => setModalActive(false)} className={styles.modalButton}>Close</button>
        </section>
        <Modal isModalActive={isPreviewActive} setModalActive={setPreviewActive}>
            <TemplatePreview arrVarNames={arrVarNames} template={temp} setModalActive={setPreviewActive} />
        </Modal>
    </div >
}


/** Рендерит структуру Template в виде строки ввода или If блока */
const TemplateBlock = ({ template: [block, ...templateRest], setTemplate, handleInput, ids }: { template: Template, setTemplate: React.Dispatch<React.SetStateAction<Template>>, handleInput: HandleInputFunc, ids: number[] }): JSX.Element => {
    if (block === undefined)
        return <></>

    let comp = (typeof block === 'string') ?
        <InputBlock block={block} setTemplate={setTemplate} handleInput={handleInput} ids={ids} /> :
        <IfBlock block={block} setTemplate={setTemplate} handleInput={handleInput} ids={ids} />

    return <>
        {comp}
        <TemplateBlock template={templateRest} setTemplate={setTemplate} handleInput={handleInput} ids={[...ids.slice(0, -1), ids.at(-1)! + 1]} />
    </>
}


// MARK: Input
/** Рендерит строку ввода, знает когда и где строка изменяется пользователем */
const InputBlock = ({ block, setTemplate, handleInput, ids }: { block: string, setTemplate: React.Dispatch<React.SetStateAction<Template>>, handleInput: HandleInputFunc, ids: number[] }): JSX.Element => {
    const handleChange = ({ target: { value } }: { target: { value: string } }) =>
        setTemplate(prevValue => changeDeep(prevValue, ids, value))

    const inputRef = useRef<HTMLTextAreaElement>(null)

    return <textarea
        value={block}
        onChange={handleChange} className={styles.inputBlock}
        ref={inputRef}
        onInput={() => handleInput(ids, inputRef.current ? inputRef.current.selectionStart : undefined)}
        onMouseUp={() => handleInput(ids, inputRef.current ? inputRef.current.selectionStart : undefined)}
        onKeyDown={() => handleInput(ids, inputRef.current ? inputRef.current.selectionStart : undefined)}
    />
}


// MARK: IfBlock
/** Рендерит блок условий, состоящий из трёх блоков для редактирования */
const IfBlock = ({ block: [ifb, thenb, elseb], setTemplate, handleInput, ids }: { block: [ifb: Template, thenb: Template, elseb: Template], setTemplate: React.Dispatch<React.SetStateAction<Template>>, handleInput: HandleInputFunc, ids: number[] }): JSX.Element => {
    const handleDelete = () => {
        setTemplate(prevValue =>
            deleteRepairDeep(prevValue, ids)
        )
    }

    return (
        <div className={styles.ifBlock}>
            <div className={styles.ifBlockLine}>
                <label className={styles.ifBlockLabel}>
                    <div className={styles.ifLabel}>IF</div>
                    <button onClick={handleDelete} className={styles.trashButton}>🗑️</button>
                </label>
                <div className={styles.editor}>
                    <TemplateBlock template={ifb} setTemplate={setTemplate} handleInput={handleInput} ids={[...ids, 0, 0]} />
                </div>
            </div>
            <div className={styles.ifBlockLine}>
                <label className={styles.ifBlockLabel}>
                    <div className={styles.ifLabel}>THEN</div>
                </label>
                <div className={styles.editor}>
                    <TemplateBlock template={thenb} setTemplate={setTemplate} handleInput={handleInput} ids={[...ids, 1, 0]} />
                </div>
            </div>
            <div className={styles.ifBlockLine}>
                <label className={styles.ifBlockLabel}>
                    <div className={styles.ifLabel}>ELSE</div>
                </label>
                <div className={styles.editor}>
                    <TemplateBlock template={elseb} setTemplate={setTemplate} handleInput={handleInput} ids={[...ids, 2, 0]} />
                </div>
            </div>
        </div>
    )
}

/** Рендерит массив arrVarNames */
const VarButtons = ({ arrVarNames, handleInsert }: { arrVarNames: string[], handleInsert: (value: string) => void }): JSX.Element => {
    return (
        <section>
            {
                arrVarNames.map(variable =>
                    <button
                        key={variable}
                        onClick={() => handleInsert(`{${variable}}`)}
                        className={styles.varButton}
                    >
                        <i>{`{${variable}}`}</i>
                    </button>
                )
            }
        </section>
    )
}