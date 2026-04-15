<?php
// api/projetos.php
// Endpoint para gerenciar projetos
// Futuramente conectar ao banco via includes/db.php

header('Content-Type: application/json');
// require_once '../includes/db.php'; // descomente quando tiver o banco

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {

    case 'GET':
        // Retorna todos os projetos
        // Exemplo futuro:
        // $stmt = $pdo->query("SELECT * FROM projetos ORDER BY criado_em DESC");
        // echo json_encode($stmt->fetchAll());

        echo json_encode([
            ['id' => 1, 'nome' => 'Dashboard Pessoal', 'status' => 'ativo', 'desc' => 'Exemplo']
        ]);
        break;

    case 'POST':
        // Salva um novo projeto
        $body   = json_decode(file_get_contents('php://input'), true);
        $nome   = trim($body['nome']   ?? '');
        $desc   = trim($body['desc']   ?? '');
        $status = trim($body['status'] ?? 'ativo');
        $tags   = trim($body['tags']   ?? '');
        $link   = trim($body['link']   ?? '');

        if (empty($nome)) {
            http_response_code(400);
            echo json_encode(['erro' => 'Nome não pode ser vazio.']);
            break;
        }

        // Exemplo futuro:
        // $stmt = $pdo->prepare("INSERT INTO projetos (nome, descricao, status, tags, link) VALUES (?,?,?,?,?)");
        // $stmt->execute([$nome, $desc, $status, $tags, $link]);
        // echo json_encode(['id' => $pdo->lastInsertId()]);

        echo json_encode(['mensagem' => 'Projeto salvo (simulado)', 'nome' => $nome]);
        break;

    case 'DELETE':
        $id = intval($_GET['id'] ?? 0);

        if (!$id) {
            http_response_code(400);
            echo json_encode(['erro' => 'ID inválido.']);
            break;
        }

        // Exemplo futuro:
        // $stmt = $pdo->prepare("DELETE FROM projetos WHERE id = ?");
        // $stmt->execute([$id]);

        echo json_encode(['mensagem' => "Projeto $id removido (simulado)"]);
        break;

    default:
        http_response_code(405);
        echo json_encode(['erro' => 'Método não permitido.']);
}
