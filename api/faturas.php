<?php
header('Content-Type: application/json');
require_once '../includes/db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {

    case 'GET':
        $cartao_id = intval($_GET['cartao_id'] ?? 0);

        if (!$cartao_id) {
            http_response_code(400);
            echo json_encode(['erro' => 'cartao_id inválido.']);
            break;
        }

        $stmt = $pdo->prepare("SELECT * FROM faturas WHERE cartao_id = ? ORDER BY criado_em ASC");
        $stmt->execute([$cartao_id]);
        echo json_encode($stmt->fetchAll());
        break;

    case 'POST':
        $body      = json_decode(file_get_contents('php://input'), true);
        $cartao_id = intval($body['cartao_id'] ?? 0);
        $mes       = intval($body['mes'] ?? date('n'));
        $ano       = intval($body['ano'] ?? date('Y'));

        if (!$cartao_id) {
            http_response_code(400);
            echo json_encode(['erro' => 'cartao_id inválido.']);
            break;
        }

        $stmt = $pdo->prepare("INSERT INTO faturas (cartao_id, mes, ano) VALUES (?,?,?)");
        $stmt->execute([$cartao_id, $mes, $ano]);
        echo json_encode(['id' => $pdo->lastInsertId(), 'cartao_id' => $cartao_id, 'mes' => $mes, 'ano' => $ano]);
        break;

    case 'DELETE':
        $id = intval($_GET['id'] ?? 0);

        if (!$id) {
            http_response_code(400);
            echo json_encode(['erro' => 'ID inválido.']);
            break;
        }

        $stmt = $pdo->prepare("DELETE FROM faturas WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['mensagem' => 'Fatura removida.']);
        break;

    case 'PATCH':
         $id   = intval($_GET['id'] ?? 0);
        $body = json_decode(file_get_contents('php://input'), true);
        $nome = trim($body['nome'] ?? '');

        if (!$id) {
        http_response_code(400);
        echo json_encode(['erro' => 'ID inválido.']);
        break;
    }

        $stmt = $pdo->prepare("UPDATE faturas SET nome = ? WHERE id = ?");
        $stmt->execute([$nome, $id]);
        echo json_encode(['mensagem' => 'Fatura atualizada.']);
        break; 

    default:
        http_response_code(405);
        echo json_encode(['erro' => 'Método não permitido.']);
}