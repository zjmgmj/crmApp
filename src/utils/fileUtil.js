import {
  AsyncStorage
} from 'react-native'
import Storage from 'react-native-storage'

const storage = new Storage({
  size: 1000,
  storageBackend: AsyncStorage,
  enableCache: true
})

/**
 * 存储
 * @param key
 * @param value
 * @param successCallback
 * @param errorCallback
 */
export function saveAsyncStorage(key, value) {
  return storage.save({
    key,
    data: value
  })
  // return new Promise((resolve, reject) => {
    // AsyncStorage.setItem(key, value, error => {
    //   if (error) {
    //     reject(error)
    //   } else {
    //     resolve()
    //   }
    // })
  // })
}

/**
 * 取值
 * @param key
 * @param successCallback
 * @param errorCallback
 */
export function getAsyncStorage(key) {
  return storage.load({
    key
  })
  // return new Promise((resolve, reject) => {
  //   AsyncStorage.getItem(key, (error, result) => {
  //     if (error) {
  //       reject(error)
  //     } else {
  //       resolve(result)
  //     }
  //   })
  // })
}

/**
 * 删除对应key的
 * @param key
 * @param successCallback
 * @param errorCallback
 */
export function removeAsyncStorage(key) {
  return storage.remove({
    key
  })
  // return new Promise((resolve, reject) => {
  //   AsyncStorage.Item(key, error => {
  //   if (error) {
  //     reject(error)
  //   } else {
  //     resolve()
  //   }
  // })
  // })
}