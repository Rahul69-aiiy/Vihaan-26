import styles from './button.module.css';

export default function button({text ,setShowRegisterModal}) {
  return (
     <div className={styles.centre}>
      <button type="button" className={styles.commonbutton} onClick={() => setShowRegisterModal(true)}>
        <div className={styles.top}>{text}</div>
        <div className={styles.bottom}></div>
      </button>
    </div>
  )
}
