import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { store } from './Store/Store'
import { Provider } from 'react-redux'
import { setUser } from './Store/Slices/userAuth'


const userJSON = localStorage?.getItem("user");
const user = userJSON ? JSON.parse(userJSON) : null;
if (user) {
  const body = {
    email: user?.email,
    userName: user?.userName,
    customerID: user?.customerID,
    isLoggedIn: true
  }
  store.dispatch(setUser(body))
}
ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <Provider store={store}>
      <App />
    </Provider>
  </>
)




