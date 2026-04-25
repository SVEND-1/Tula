import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import './style/AuthForm.scss';
import './style/global.css'
import './style/LikedAnimals.scss'
import './style/AnimalDetails.scss'
import './style/AdminAnimals.scss'
import './style/MainPage.scss'
import './style/OwnerProfile.scss'

import './style/subscription/SubscriptionPage.scss'

import './style/payment-history/PaymentHistoryPage.scss'
import './style/payment-history/PaymentDetails.css'
import './style/payment-history/Pagination.css'
import './style/payment-history/PaymentList.css'
import './style/payment-history/ReceiptDetails.css'



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
