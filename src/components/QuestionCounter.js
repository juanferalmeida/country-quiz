import { html, css, LitElement } from "lit";
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js'

export class QuestionCounter extends LitElement {
  static styles = css`
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 800px;
    }
    .counter-container {
      display: flex;
    }
    .counter-circle {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: #373d6d;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 18px;
      font-weight: bold;
      color: white;
      margin: 0 5px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    }
    .buttons-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    }
    .correct-answer {
      background: linear-gradient(to right, #ff69b4, #800080);
    }

    .error-answer {
      background: linear-gradient(to right, #ff0000, #8b0000);
    }

    .restart-button {
      margin-top: 20px;
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      background-color: #242951;
      color: white;
      font-size: 16px;
      cursor: pointer;
      font-family: "Amaranth", sans-serif;
    }

    .restart-button:hover {
      background-color: #393f6f;
    }
  `;
  static properties = {
    maxQuestions: { type: Number },
    currentQuestion: { type: Number },
    countriesData: { type: Array },
    selectedQuestion: { type: String },
    showIcon: { type: Boolean },
    correctAnswers: { type: Number },
  };

  constructor() {
    super();
    this.maxQuestions = 10;
    this.currentQuestion = 1;
    this.countriesData = [];
    this.selectedQuestion = "";
    this.showIcon = false;
    this.correctAnswers = 0;
  }

  connectedCallback() {
    super.connectedCallback();
    this.fetchCountriesData();
  }

  async fetchCountriesData() {
    try {
      const response = await fetch("../demo/countries.json");
      const data = await response.json();
      this.countriesData = data.map((country) => ({
        name: country.name,
        flag: country.flags.png,
      }));
      this.selectRandomCountries();
      this.selectRandomQuestion();
    } catch (error) {
      console.error("Error:", error);
    }
  }

  selectRandomCountries() {
    const selectedCountries = [];
    while (selectedCountries.length < 4) {
      const randomCountry =
        this.countriesData[
          Math.floor(Math.random() * this.countriesData.length)
        ];
      if (!selectedCountries.includes(randomCountry)) {
        selectedCountries.push(randomCountry);
      }
    }
    this.countriesData = selectedCountries;
  }

  

  selectRandomQuestion() {
    this.selectedCountryQuestion =
      this.countriesData[Math.floor(Math.random() * this.countriesData.length)];
    console.log(this.selectedCountryQuestion);
    this.countriesData.forEach((country) => {
      if (country.name === this.selectedCountryQuestion.name) {
        country.isCorrect = true;
      } else {
        country.isCorrect = false;
      }
    });

    this.selectedQuestion = `¿De qué país es esta bandera <img src="${this.selectedCountryQuestion.flag}" alt="Bandera del país" width="100" height="50" />?`;
    ;
  }

  processCountrySelection(event) {
    const currentCountry = event.data;
    this.showIcon = true;
    console.log(currentCountry);
    if (currentCountry.isCorrect) {
      this.correctAnswers++;
      setTimeout(() => {
        this.selectRandomCountries();
        this.selectRandomQuestion();
        this.showIcon = false;
      }, 1000);

      const currentCircleNumber = this.currentQuestion;
      const currentCircle = this.shadowRoot.querySelector(
        `.counter-circle:nth-child(${currentCircleNumber})`
      );
      currentCircle.classList.add("correct-answer");
      this.currentQuestion++;
    } else {
      setTimeout(() => {
        this.selectRandomCountries();
        this.selectRandomQuestion();
        this.showIcon = false;
      }, 1000);
      // selecciona el circulo correspondiente al numero de pregunta actual y anade la clase
      const currentCircleNumber = this.currentQuestion;
      const currentCircle = this.shadowRoot.querySelector(
        `.counter-circle:nth-child(${currentCircleNumber})`
      );
      currentCircle.classList.add("error-answer");
      this.currentQuestion++;
    }
  }

  render() {
    const circles = [];
    for (let i = 1; i <= this.maxQuestions; i++) {
      circles.push(html`<div class="counter-circle">${i}</div>`);
    }
    if (this.currentQuestion > this.maxQuestions) {
      return html`
        <div class="container">
        <img src="../assets/congratulation.png" alt="Congratulations" width="200">
          <h2 style="font-family: 'Amaranth'; color: white;">Felicitaciones por completar todas las preguntas!</h2>
          <p style="font-family: 'Amaranth'; color: white;">
            Respuestas correctas: ${this.correctAnswers}/${this.maxQuestions}
          </p>
          <button @click="${this.restartGame}" class="restart-button">
            Reiniciar
          </button>
        </div>
      `;
    }
    return html`
      <div class="container">
        <div class="counter-container">${circles}</div>
        <h2 style="font-family: 'Amaranth'; color: white;">
          ${unsafeHTML(this.selectedQuestion)}
        </h2>
        <div class="buttons-container">
          ${this.countriesData.map(
            (item) => html`
              <country-button
                .country="${item}"
                .showIcon="${this.showIcon}"
                @country-event="${this.processCountrySelection}"
              ></country-button>
            `
          )}
        </div>
      </div>
    `;
  }

  restartGame() {
    this.currentQuestion = 1;
    this.correctAnswers = 0;
    this.selectRandomCountries();
    this.selectRandomQuestion();
  }
}

window.customElements.define("question-counter", QuestionCounter);
