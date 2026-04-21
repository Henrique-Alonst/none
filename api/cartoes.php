<?php 
header('Content-Type: application/json');
require_once '../includes/db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {

    case 'GET':
        $stmt = $pdo->query("SELECT * FROM cartoes ORDER BY criado_em ASC");
        echo json_encode($stmt->fetchAll());
        break;

    case 'POST':
        $body = json_decode(file_get_contents('php://input'), true);
        $nome = trim($body['nome'] ?? '');

        if (empty($nome)) {
            http_response_code(400);
            echo json_encode(['erro' => 'Nome não pode ser vazio.']);
            break;
        }

        $stmt = $pdo->prepare("INSERT INTO cartoes (nome) VALUES (?)");
        $stmt->execute([$nome]);
        echo json_encode(['id' => $pdo->lastInsertId(), 'nome' => $nome]);
        break;

    case 'PATCH':
        $id       = intval($_GET['id'] ?? 0);
        $body     = json_decode(file_get_contents('php://input'), true);
        $nome     = trim($body['nome'] ?? '');
        $limite = floatval($body['limite'] ?? 0);

        if (!$id) {
            http_response_code(400);
            echo json_encode(['erro' => 'ID inválido.']);
            break;
        }

        $stmt = $pdo->prepare("UPDATE cartoes SET nome = ?, limite = ? WHERE id = ?");
        $stmt->execute([$nome, $limite, $id]);
        echo json_encode(['mensagem' => 'cartão atualizado.']);
        break;

    case 'DELETE':
        $id = intval($_GET['id'] ?? 0);

        if (!$id) {
            http_response_code(400);
            echo json_encode(['erro' => 'ID inválido.']);
            break;
        }

        $stmt = $pdo->prepare("DELETE FROM cartoes WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['mensagem' => 'cartão removido.']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['erro' => 'Método não permitido.']);
}

