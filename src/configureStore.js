import { applyMiddleware, compose, createStore } from 'redux'
import sagaMiddlewareFactory from 'redux-saga'
import { rootReducer } from './reducers'
import { rootSaga } from './sagas'

export const configureStore = () => {
  const sagaMiddleware = sagaMiddlewareFactory()
  const middleware = applyMiddleware(sagaMiddleware)
  const store = createStore(rootReducer, compose(middleware))

  sagaMiddleware.run(rootSaga)
  return store
}
