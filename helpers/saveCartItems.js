const saveCartItems = (listaDeItens) => localStorage.setItem('cartItems', listaDeItens);

if (typeof module !== 'undefined') {
  module.exports = saveCartItems;
}
