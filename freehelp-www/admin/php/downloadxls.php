<?php
    $domain = $_SERVER['SERVER_NAME'];

require_once ("../../common/php/path.php");
require_once("../../common/php/base.php");

$table = "appuser";//$_GET["table"];
$filename = "services.xls";
$query = "SELECT * from $table WHERE 1=1";

if ($table == "service")
{
    $array = array(
        "id",
        "name as 'Nome'",
        "datacadastro as 'Data Cadastro'",
        "IF(status=0, 'NAO', 'SIM') as 'Ativo'",
        "datacadastro as 'Data de Cadastro'",
        "(SELECT name FROM category WHERE id=service.category1) as 'Categoria 1'",
        "(SELECT name FROM subcategory WHERE id=service.subcategory1) as 'Sub Categoria 1'",
        "(SELECT name FROM occupation WHERE id=service.occupation1) as 'Ocupacao 1'",
        "(SELECT name FROM category WHERE id=service.category2) as 'Categoria 2'",
        "(SELECT name FROM subcategory WHERE id=service.subcategory2) as 'Sub Categoria 2'",
        "(SELECT name FROM occupation WHERE id=service.occupation2) as 'Ocupacao 2'",
        "(SELECT name FROM category WHERE id=service.category3) as 'Categoria 2'",
        "(SELECT name FROM subcategory WHERE id=service.subcategory3) as 'Sub Categoria 3'",
        "(SELECT name FROM occupation WHERE id=service.occupation3) as 'Ocupacao 3'",
        "end_cep as CEP",
        "end_endereco as Rua",
        "end_numero as Numero",
        "end_bairro as Bairro",
        "end_complemento as Complemento",
        "celular as Celular",
        "telefone as Telefone",
        "description as Descricao",
        "site as Site",
        "mail as Email",
    );
    
    $query = "";
    $query .= "SELECT ";
    foreach ($array as $i => $value) 
    {
        if ($i != 0) $query .= ",";
        $query .= $value;
    }
    $query .= " FROM $table WHERE 1=1 ORDER BY id";
}
else if ($table == "category")
{
    $query = "SELECT id, name as Nome FROM $table WHERE 1=1 ORDER BY id";
}
else if ($table == "subcategory")
{
    $query = "SELECT id, (SELECT name FROM category WHERE id=$table.category) as 'Categoria', name as Nome FROM $table WHERE 1=1 ORDER BY id";
}
else if ($table == "occupation")
{
    $query = "SELECT id, (SELECT name FROM category WHERE id=$table.category) as 'Categoria', (SELECT name FROM subcategory WHERE id=$table.subcategory) as 'Sub Categoria', name as Nome FROM $table WHERE 1=1 ORDER BY id";
}
else if ($table == "user")
{
    $array = array(
        "id",
        "mail as Email",
        "IF(status=0, 'NAO', 'SIM') as 'Ativo'",
        "datacadastro as 'Data Cadastro'",
        "cpf as CPF",
        "nascimento as 'Data de nascimento'",
        "how as 'Como conheceu o FreeHelp'",
    );
    
    $query = "";
    $query .= "SELECT ";
    foreach ($array as $i => $value) 
    {
        if ($i != 0) $query .= ",";
        $query .= $value;
    }
    $query .= " FROM $table WHERE 1=1 ORDER BY id";
}
else if ($table == "appuser")
{
    $array = array(
        "id",
        "name as Nome",
        "login as Login",
        "IF(status=0, 'NAO', 'SIM') as 'Ativo'",
        "datacadastro as 'Data Cadastro'",
    );
    
    $query = "";
    $query .= "SELECT ";
    foreach ($array as $i => $value) 
    {
        if ($i != 0) $query .= ",";
        $query .= $value;
    }
    $query .= " FROM $table WHERE 1=1 ORDER BY id";
}
else if ($table == "banner")
{
   $array = array(
        "id",
        "(SELECT name FROM category WHERE id=$table.category) as Categoria",
        "action as Acao",
        "datacadastro as 'Data Cadastro'",
    );
    
    $query = "";
    $query .= "SELECT ";
    foreach ($array as $i => $value) 
    {
        if ($i != 0) $query .= ",";
        $query .= $value;
    }
    $query .= " FROM $table WHERE 1=1 ORDER BY id"; 
}

$download_me = TSV::QueryAsTSV($query); 
//header("Content-type: text/plain; charset=utf-8");
//header("Content-Disposition: attachment; filename=$filename");
echo $download_me;
?>