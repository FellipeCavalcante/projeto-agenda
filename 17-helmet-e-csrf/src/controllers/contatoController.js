const Contato = require('../models/ContatoModel');

exports.index = (req, res) => {
  res.render('contato', { contato: {} });
};

exports.register = async (req, res) => {
  try {
    const contato = new Contato(req.body);
    await contato.register();

    if (contato.errors.length > 0) {
      req.flash('errors', contato.errors);
      req.session.save(() => {
        res.redirect('/contato/index');
      });
      return;
    }

    req.flash('success', 'Contato registrado com sucesso');
    req.session.save(() => {
      res.redirect(`/contato/index/${contato.contato._id}`);
    });
    return;
  } catch (error) {
    console.log(error);
    return res.render('404');
  }
};

exports.editIndex = async (req, res) => {
  if (!req.params.id) return res.render('404');

  const contato = await Contato.buscaPorId(req.params.id);
  
  if (!contato) return res.render('404');  // Verifica se "contato" existe

  res.render('contato', { contato });  // Corrige o caminho da view
};

exports.edit = async (req, res) => {
  try {
    if (!req.params.id) return res.render('404');
    
    // Instanciar o contato e editar
    const contato = new Contato(req.body);
    await contato.edit(req.params.id);  // Certifique-se de que o método edit existe no modelo
  
    if (contato.errors.length > 0) {
      req.flash('errors', contato.errors);
      req.session.save(() => {
        res.redirect(`/contato/index/${req.params.id}`);  // Ajuste para voltar ao formulário de edição
      });
      return;
    }
  
    req.flash('success', 'Contato editado com sucesso');
    req.session.save(() => {
      res.redirect(`/contato/index/${contato.contato._id}`);  // Ajuste para a rota correta
    });
    return;
  } catch (error) {
    console.log(error);
    res.render('404');
  }
};
