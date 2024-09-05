import validator from "validator";

export default class Login {
  constructor(formClass) {
    this.form = document.querySelector(formClass);
  }

  init() {
    this.events();
  }

  events() {
    if (!this.form) return;
    this.form.addEventListener('submit', e => {
      e.preventDefault();
      alert('FORM NÃO EXISTE');
    })
  }

  validate(e) {
    const el = e.target;
    const email = el.querySelector('input[name="email"]');
    const password = el.querySelector('input[name="password"]');
    let error = false

    if (!validator.isEmail(email.value)) {
      alert('Email inválido')
      error = true;
    }

    if (password.value.length < 3 || password.value.length > 50) {
      alert('Senha inválida')
      error = true;
    }

    if (!error) el.submit();
  }
}