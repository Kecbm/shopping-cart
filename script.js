const carregandoNaPagina = async () => {
  const elementos = await fetchProducts('computador');
  if (elementos) document.querySelector('.loading').remove();
};

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const li = document.querySelector('.cart__items');

const somaTotalDosItens = (preco, soma) => {
  const paragrafo = document.querySelector('.total-price');
  if (soma) {
    paragrafo.innerText = +paragrafo.innerText + preco;
  } else {
    paragrafo.innerText = +paragrafo.innerText - preco;
  }
};

function cartItemClickListener(event) {
  // coloque seu código aqui
  const preco = event.target.innerText.split('$');
  somaTotalDosItens(preco[1]);
  event.target.remove();
  saveCartItems(li.innerHTML);
}

function createCartItemElement({ sku, name, salePrice }) {
  const itemDaLista = document.createElement('li');
  itemDaLista.className = 'cart__item';
  itemDaLista.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  itemDaLista.addEventListener('click', cartItemClickListener);
  return itemDaLista;
}

const adicionarProdutoNoCarrinho = async () => {
  const botaoAdicionar = document.querySelectorAll('.item__add');

  return botaoAdicionar.forEach((botao) => {
    botao.addEventListener('click', async (evento) => {
      const itemId = await getSkuFromProductItem(evento.target.parentNode);
      const { id: sku, title: name, price: salePrice } = await fetchItem(itemId);
      li.appendChild(createCartItemElement({ sku, name, salePrice }));
      somaTotalDosItens(salePrice, true);
      saveCartItems(li.innerHTML);
    });
  });
};

const esvaziarOCarrinho = () => {
  const botao = document.querySelector('.empty-cart');
  botao.addEventListener('click', () => {
    li.innerHTML = '';
    const paragrafo = document.querySelector('.total-price');
    paragrafo.innerText = '';
    saveCartItems(li.innerHTML);
  });
};

const exibeProdutosNaTela = async () => {
const arr = await fetchProducts('computador');

arr.results.forEach(({ id: sku, title: name, thumbnail: image }) => {
  const produtosNaTela = createProductItemElement({ sku, name, image });
  const secaoItens = document.querySelector('.items');
  secaoItens.appendChild(produtosNaTela);
});
  adicionarProdutoNoCarrinho();
  esvaziarOCarrinho();
};

window.onload = async () => { 
  carregandoNaPagina();
  await exibeProdutosNaTela(); 
  document.querySelector('.cart__items').innerHTML = getSavedCartItems();
  li.childNodes.forEach((item) => item
    .addEventListener('click', (event) => {
     event.target.remove();
     saveCartItems(li.innerHTML);
    })); 
};
