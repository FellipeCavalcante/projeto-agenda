const mongoose = require('mongoose');
const validator = require('validator');

const ContatoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  sobrenome: { type: String, required: false, default: '' },
  email: { type: String, required: false, default: '' },
  telefone: { type: String, required: false, default: '' },
  criadoEm: { type: Date, default: Date.now },
});

const ContatoModel = mongoose.model('Contato', ContatoSchema);

function Contato(body) {
  this.body = body;
  this.errors = [];
  this.contato = null;
}



// Método para registrar um novo contato
Contato.prototype.register = async function() {
  this.valida();
  if (this.errors.length > 0) return;
  this.contato = await ContatoModel.create(this.body);
};

// Valida os campos do contato
Contato.prototype.valida = function() {
  this.cleanUp();
  if (this.body.email && !validator.isEmail(this.body.email)) this.errors.push('E-mail inválido');
  if (!this.body.nome) this.errors.push('Nome é um campo obrigatório.');
  if (!this.body.email && !this.body.telefone) this.errors.push('Cadastre email ou telefone.');
};

// Limpa os dados, garantindo que todos os campos sejam strings
Contato.prototype.cleanUp = function() {
  for (let key in this.body) {
    if (typeof this.body[key] !== 'string') {
      this.body[key] = '';  
    }
  }

  this.body = {
    nome: this.body.nome,
    sobrenome: this.body.sobrenome,
    email: this.body.email,
    telefone: this.body.telefone
  };
};

// Método para editar um contato
Contato.prototype.edit = async function(id) {
  if (typeof id !== 'string') return;
  
  this.valida();
  if (this.errors.length > 0) return;

  this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, { new: true });
};

// METODOS ESTÁTICOS
// Método para buscar um contato por ID
Contato.buscaPorId = async function(id) {
  if (typeof id !== 'string') return;
  const contato = await ContatoModel.findById(id);
  return contato;
};

Contato.buscaContatos = async function(id) {
  const contatos = await ContatoModel.find(id)
    .sort({ criadoEm: -1 });
  return contatos;
};

Contato.delete = async function(id) {
  if (typeof id !== 'string') return;
  const contato = await ContatoModel.findOneAndDelete({ _id: id });
  return contato;
};

module.exports = Contato;
