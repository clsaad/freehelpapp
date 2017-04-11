<?php
    $domain = $_SERVER['SERVER_NAME'];
    require_once("../../common/php/path.php");
    require_once("../../common/php/base.php");

    $table = $_GET["table"];
    $download_me = TSV::QueryAsTSV("SELECT * FROM $table WHERE 1=1", FALSE);
    header("Content-type: text/plain; charset=utf-8");
    header("Content-Disposition: attachment; filename=$table.tsv");
    echo $download_me;
?>