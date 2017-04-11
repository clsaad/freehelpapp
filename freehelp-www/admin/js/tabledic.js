var TableDic = {};

TableDic.GetHeader = function(entry)
{
    var _out = entry;
    if (entry == "id") _out = "ID";
    if (entry == "image") _out = "Imagem";
    if (entry == "name") _out = "Nome";
    if (entry == "how") _out = "Como conheceu";
    if (entry == "actions") _out = "Ações";
    if (entry == "status") _out = "Ativo";
    if (entry == "mail") _out = "Email";
    if (entry == "cpf") _out = "CPF";
    if (entry == "stars") _out = "Estrelas";
    if (entry == "text") _out = "Texto";
    if (entry == "nascimento") _out = "Data de Nascimento";
    if (entry == "datacadastro") _out = "Data de Cadastro";
    if (entry == "login") _out = "Login";
    if (entry == "type") _out = "Tipo";
    if (entry == "userid") _out = "ID do Fornecedor";
    if (entry == "end_cep") _out = "CEP";
    if (entry == "end_endereco") _out = "Endereço";
    if (entry == "end_numero") _out = "Número";
    if (entry == "end_bairro") _out = "Bairro";
    if (entry == "end_complemento") _out = "Complemento";
    if (entry == "latitude") _out = "Latitude";
    if (entry == "longitude") _out = "Longitude";
    if (entry == "celular") _out = "Celular";
    if (entry == "telefone") _out = "Telefone";
    if (entry == "description") _out = "Descrição";
    if (entry == "site") _out = "Site";
    if (entry == "category") _out = "Categoria";
    if (entry == "category1") _out = "Categoria 1";
    if (entry == "category2") _out = "Categoria 2";
    if (entry == "category3") _out = "Categoria 3";
    if (entry == "subcategory") _out = "Sub-Categoria";
    if (entry == "subcategory1") _out = "Sub-Categoria 1";
    if (entry == "subcategory2") _out = "Sub-Categoria 2";
    if (entry == "subcategory3") _out = "Sub-Categoria 3";
    
    return _out;
}