<?php
// api/notas.php
// Endpoint para gerenciar anotações
// Futuramente conectar ao banco via includes/db.php

header('Content-Type: application/json');
// require_once '../includes/db.php'; // descomente quando tiver o banco

$method = $_SERVER['REQUEST_METHOD'];

// Roteamento por método HTTP
switch ($method) {

    case 'GET':
        // Retorna todas as notas
        // Exemplo futuro:
        // $stmt = $pdo->query("SELECT * FROM notas ORDER BY criado_em DESC");
        // echo json_encode($stmt->fetchAll());

        echo json_encode([
            ['id' => 1, 'texto' => 'Nota de exemplo', 'criado_em' => date('Y-m-d H:i:s')]
        ]);
        break;

    case 'POST':
        // Salva uma nova nota
        $body  = json_decode(file_get_contents('php://input'), true);
        $texto = trim($body['texto'] ?? '');

        if (empty($texto)) {
            http_response_code(400);
            echo json_encode(['erro' => 'Texto não pode ser vazio.']);
            break;
        }

        // Exemplo futuro:
        // $stmt = $pdo->prepare("INSERT INTO notas (texto) VALUES (?)");
        // $stmt->execute([$texto]);
        // echo json_encode(['id' => $pdo->lastInsertId(), 'texto' => $texto]);

        echo json_encode(['mensagem' => 'Nota salva (simulado)', 'texto' => $texto]);
        break;

    case 'DELETE':
        // Remove uma nota por ID
        $id = intval($_GET['id'] ?? 0);

        if (!$id) {
            http_response_code(400);
            echo json_encode(['erro' => 'ID inválido.']);
            break;
        }

        // Exemplo futuro:
        // $stmt = $pdo->prepare("DELETE FROM notas WHERE id = ?");
        // $stmt->execute([$id]);

        echo json_encode(['mensagem' => "Nota $id removida (simulado)"]);
        break;

    default:
        http_response_code(405);
        echo json_encode(['erro' => 'Método não permitido.']);
}
