
import styles from './styles.module.css'

/** Открывает child компонент в отдельном окне.
 * Reference: https://youtu.be/i2Yf7JZonB4
 */
export const Modal = ({ isModalActive, setModalActive, children }: { isModalActive: boolean, setModalActive: React.Dispatch<React.SetStateAction<boolean>>, children: JSX.Element }): JSX.Element => {
    return (
        <div className={isModalActive ? [styles.modal, styles.active].join(' ') : styles.modal} onClick={() => setModalActive(false)}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                {isModalActive && children}
            </div>
        </div>
    )
}  