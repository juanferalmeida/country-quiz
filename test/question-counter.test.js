import { html, fixture, expect } from '@open-wc/testing';
import { QuestionCounter } from '../src/components/QuestionCounter.js';

describe('QuestionCounter', () => {
  it('renders a question with options', async () => {
    const el = await fixture(html`
      <question-counter></question-counter>
    `);
    await el.updateComplete;

    await new Promise(resolve => setTimeout(resolve, 500));

    const questionText = el.selectedQuestion;

    expect(questionText).to.include('De qué país es esta bandera');
  });
});