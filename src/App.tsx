import { useEffect, useRef, useState } from 'react';
import styles from './App.module.css'
import { Modal } from './components/Modal/Modal';
import { TemplateEditor } from './components/TemplateEditor/TemplateEditor';
import { Template } from './model/template';

function App() {
  let arrVarNames = useRef<string[]>([])
  let template = useRef<Template | null>(null)
  const callbackSave = (template: Template) => {
    localStorage.setItem('template', JSON.stringify(template))
  }

  const [isModalActive, setModalActive] = useState(false)

  // Данные загружаются при каждом открытии виджета
  useEffect(() => {
    arrVarNames.current = localStorage.arrVarNames ?
      JSON.parse(localStorage.arrVarNames) :
      ['firstname', 'lastname', 'company', 'position']
    template.current = localStorage.template ?
      JSON.parse(localStorage.template) :
      null
  }, [isModalActive])

  return (
    <div className={styles.App}>
      <button onClick={() => setModalActive(true)}>Message Editor</button>
      <p>{isModalActive}</p>
      <Modal isModalActive={isModalActive} setModalActive={setModalActive}>
        <TemplateEditor arrVarNames={arrVarNames.current} template={template.current} callbackSave={callbackSave} setModalActive={setModalActive} />
      </Modal>
    </div>
  )
}
export default App;
