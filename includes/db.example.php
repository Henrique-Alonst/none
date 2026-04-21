<?php
// Exemplo de configuração. Renomeie para db.php e coloque seus dados.
$host = 'localhost';
$db   = 'nome_do_banco';
$user = 'usuario';
$pass = 'senha';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
} catch (PDOException $e) {
    die("Erro: " . $e->getMessage());
}