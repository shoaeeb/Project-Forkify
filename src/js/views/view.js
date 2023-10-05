import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  /**
   * Render the recieved Object to the DOM
   *
   * @param {Object | Object[]} data The data to be rendered (e.g.recipe)
   * @param {boolean} [render=true] if false,create markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render=false;
   * @this {Object} View Instance
   * @author Shoaeeb Osman
   * @todo Finished implementation
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();
    if (!render) return markup;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;

    //newMarkup is a string
    const newMarkup = this._generateMarkup();
    //compare newMarkup to oldMarkup

    //convert the string into real dom node object
    const newDom = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDom.querySelectorAll('*'));
    const currentElements = Array.from(
      this._parentElement.querySelectorAll('*')
    );
    console.log(currentElements);
    console.log(newElements);

    newElements.forEach((newEle, i) => {
      //loop over the two arrays
      const curEl = currentElements[i];
      //checks whether the newEl is equal to current Node
      // console.log(curEl, newEle.isEqualNode(curEl));
      if (
        !newEle.isEqualNode(curEl) &&
        newEle.firstChild?.nodeValue.trim() !== ''
      ) {
        //checks whether the node contains only text
        //and not an element
        // console.log('💥', newEle.firstChild.nodeValue.trim());
        curEl.textContent = newEle.textContent;
      }
      //update changed attribute
      if (!newEle.isEqualNode(curEl)) {
        Array.from(newEle.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }
  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const html = `
        <div class="spinner">
                <svg>
                  <use href="${icons}#icon-loader"></use>
                </svg>
        </div>
        `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', html);
  }

  renderError(message = this._errorMessage) {
    const markup = `
              <div class="error">
                <div>
                  <svg>
                    <use href="${icons}#icon-alert-triangle"></use>
                  </svg>
                </div>
                <p>${message}</p>
              </div>
        `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
              <div class="message">
                <div>
                  <svg>
                    <use href="${icons}#icon-smile"></use>
                  </svg>
                </div>
                <p>${message}</p>
              </div>
        `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
