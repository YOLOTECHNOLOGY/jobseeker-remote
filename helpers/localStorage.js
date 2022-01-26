/*
  List of localStorage keys to be cleared when exiting page
*/ 

export const toClearWhenExitPage = ['slate-rte']

/*
  Checking the type of localStorage is to prevent error
  when the code is being executed server-sided 
*/
export const itemExist = (item) => {
  if (typeof localStorage !== 'undefined' && localStorage.getItem(item)) {
    return true
  }
  return false
}

// Set Item into LocalStorage
export const setItem = (itemName, item) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(itemName, item)
  }
}

// Remove Item from LocalStorage

export const removeItem = (item) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(item)
  }
}

// Get Item from LocalStorage
export const getItem = (item) => {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem(item)
  }
}
