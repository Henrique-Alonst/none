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

        $stmt = $pdo->prepare("SELECT * FROM gastos WHERE cartao_id = ? ORDER BY criado_em ASC");
        $stmt->execute([$cartao_id]);
        echo json_encode($stmt->fetchAll());
        break;

    case 'POST':
        $body   = json_decode(file_get_contents('php://input'), true);
        $cartao_id = intval($body['cartao_id'] ?? 0);
        $nome   = trim($body['nome']   ?? '');
        $valor  = floatval($body['valor'] ?? 0);

        if (!$cartao_id || empty($nome)) {
            http_response_code(400);
            echo json_encode(['erro' => 'Dados inválidos.']);
            break;
        }

        $stmt = $pdo->prepare("INSERT INTO gastos (cartao_id, nome, valor) VALUES (?,?,?)");
        $stmt->execute([$cartao_id, $nome, $valor]);
        echo json_encode(['id' => $pdo->lastInsertId(), 'nome' => $nome, 'valor' => $valor]);
        break;

    case 'PATCH':
        $id    = intval($_GET['id'] ?? 0);
        $body  = json_decode(file_get_contents('php://input'), true);

        if (!$id) {
            http_response_code(400);
            echo json_encode(['erro' => 'ID inválido.']);
            break;
        }

        // Atualiza só o que foi enviado
        if (isset($body['pago'])) {
            $stmt = $pdo->prepare("UPDATE gastos SET pago = ? WHERE id = ?");
            $stmt->execute([intval($body['pago']), $id]);
        } elseif (isset($body['valor'])) {
            $stmt = $pdo->prepare("UPDATE gastos SET valor = ? WHERE id = ?");
            $stmt->execute([floatval($body['valor']), $id]);
        }

        echo json_encode(['mensagem' => 'Gasto atualizado.']);
        break;

    case 'DELETE':
        $id = intval($_GET['id'] ?? 0);

        if (!$id) {
            http_response_code(400);
            echo json_encode(['erro' => 'ID inválido.']);
            break;
        }

        $stmt = $pdo->prepare("DELETE FROM gastos WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['mensagem' => 'Gasto removido.']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['erro' => 'Método não permitido.']);
}