<?php
// includes/db.php
// Conexão com o banco de dados MySQL
// Preencha com suas credenciais quando for integrar o backend

define('DB_HOST', 'localhost');
define('DB_NAME', 'meu_ambiente');
define('DB_USER', 'root');
define('DB_PASS', '');

try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8",
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );
} catch (PDOException $e) {
    // Em produção, nunca exiba o erro diretamente
    die(json_encode(['erro' => 'Falha na conexão com o banco de dados.']));
}
