import { useState } from "react"
import { generate_message, Template } from "../../model/template"
import styles from './styles.module.css'


// MARK: Template Preview
/** Позволяет генерировать сообщение из шаблона и вводить данные для переменных */
export const TemplatePreview = ({ arrVarNames, template, setModalActive }: { arrVarNames: string[], template: Template, setModalActive: React.Dispatch<React.SetStateAction<boolean>> }): JSX.Element => {
    const [variables, setVariables] = useState(
        arrVarNames.reduce<{ [key: string]: string }>((accum, el) => {
            accum[el] = ''
            return accum
        }, {}))

    return <div className={styles.templatePreview}>
        <h5>Message Preview</h5>
        <textarea value={generate_message(template, variables)} readOnly={true} className={styles.message} />
        <section className={styles.variablesBlock}>
            <b className={styles.variableText}>Variables :</b>
            <VariableInputs arrVarNames={arrVarNames} setVariables={setVariables} />
        </section>
        <button onClick={() => setModalActive(false)} className={styles.modalButton}>Close</button>
    </div>
}



/** Рендерит поля для ввода данных для переменных */
const VariableInputs = ({ arrVarNames, setVariables }: { arrVarNames: string[], setVariables: React.Dispatch<React.SetStateAction<{ [key: string]: string; }>> }) => {
    const handleChange = (variable: string) => (e: React.ChangeEvent<HTMLInputElement>) => setVariables(prevVars =>
        ({ ...prevVars, [variable]: e.target.value })
    )

    return <>
        {
            arrVarNames.map(variable =>
                <div key={variable} className={styles.variable}>
                    <label>{variable}</label>
                    <input name={variable} placeholder={variable} onChange={handleChange(variable)} />
                </div>
            )
        }
    </>
}