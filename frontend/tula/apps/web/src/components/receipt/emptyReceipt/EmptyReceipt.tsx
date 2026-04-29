import React from 'react';
import styles from './EmptyReceipt.module.css';

import receiptIcon from '../../../assets/receipt.svg'




const EmptyReceipt: React.FC = () => (



        <div className={styles.empty}>
            <img src={receiptIcon} alt="receipt" className={styles.icon}/>
            <p className={styles.title}>Выберите платёж</p>
            <p className={styles.sub}>Нажмите на любой платёж слева, чтобы увидеть чек</p>
        </div>

);

export default EmptyReceipt;
