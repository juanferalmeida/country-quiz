import { LitElement, html, css } from "lit";

export class CountryButton extends LitElement {
  static styles = css`
    button {
      margin: 5px;
      padding: 10px;
      border: none;
      color: white;
      text-align: center;
      text-decoration: none;
      font-size: 16px;
      cursor: pointer;
      border-radius: 5px;
      width: 300px;
      height: 50px;
      background-color: #393f6f;
    }

    .icon {
      height: 20px;
      transform: translateY(-50%);
      display: none;
    }

    button.show-icon .icon {
      display: block;
    }
   
  `;

  static properties = {
    country: { type: Object },
    showIcon:{ type: Boolean },

  };

  dispatchCountryEvent() {
    this.dispatchEvent(new CustomEvent("country-event", { data: this.country }));
}
render() {
    return html`
      <button
        @click="${this.dispatchCountryEvent}"
        class="${this.showIcon ? 'show-icon' : ''}">
       ${this.country.name}
       <img class="icon" src="${this.country.isCorrect ? '../assets/checked.png' : '../assets/cross.png'}" alt="image" />
      </button>
    `;
  }
}

window.customElements.define("country-button", CountryButton);