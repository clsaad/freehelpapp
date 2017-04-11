<?php
// Inclui o arquivo class.phpmailer.php localizado na pasta phpmailer


require_once("phpmailer/class.phpmailer.php");
require_once("phpmailer/class.smtp.php");


function SendMail($to, $subject, $message, $flatMessage)
{
    $message = preg_replace("/\r\n|\r|\n/",'<br/>',$message);
    $flatMessage = preg_replace("/\r\n|\r|\n/",'<br/>',$flatMessage);
    
    // Inicia a classe PHPMailer
    $mail = new PHPMailer();

    // Define os dados do servidor e tipo de conexão
    // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    $mail->IsSMTP(); // Define que a mensagem será SMTP
    $mail->Host = "smtp.freehelpapp.com.br"; // Endereço do servidor SMTP
    $mail->Port = 587;
    $mail->SMTPAuth = true; // Usa autenticação SMTP? (opcional)
    $mail->Username = 'freehelp@freehelpapp.com.br'; // Usuário do servidor SMTP
    $mail->Password = 'WKq9h!%ee('; // Senha do servidor SMTP

    // Define o remetente
    // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    $mail->From = "freehelp@freehelpapp.com.br"; // Seu e-mail
    $mail->FromName = "Equipe FreeHelp"; // Seu nome

    // Define os destinatário(s)
    // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    $mail->AddAddress($to, 'Usuario FreeHelp');
    //$mail->AddCC('ciclano@site.net', 'Ciclano'); // Copia
    //$mail->AddBCC('fulano@dominio.com.br', 'Fulano da Silva'); // Cópia Oculta

    // Define os dados técnicos da Mensagem
    // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    $mail->IsHTML(true); // Define que o e-mail será enviado como HTML
    $mail->CharSet = 'utf-8';// 'iso-8859-1'; // Charset da mensagem (opcional)

    // Define a mensagem (Texto e Assunto)
    // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    $mail->Subject  = $subject; // Assunto da mensagem
    $mail->Body = $message;
    $mail->AltBody = $flatMessage;

    // Define os anexos (opcional)
    // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    //$mail->AddAttachment("c:/temp/documento.pdf", "novo_nome.pdf");  // Insere um anexo

    // Envia o e-mail
    $enviado = $mail->Send();

    // Limpa os destinatários e os anexos
    $mail->ClearAllRecipients();
    $mail->ClearAttachments();

    // Exibe uma mensagem de resultado
    if ($enviado) {
    //echo "E-mail enviado com sucesso!";
    } else {
    //echo "Não foi possível enviar o e-mail.";
    //echo "<b>Informações do erro:</b> " . $mail->ErrorInfo;
    //return $mail->ErrorInfo;
        return "0";
    }
    
    return "1";
}


