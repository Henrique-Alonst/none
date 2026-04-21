<?php
header('Content-Type: application/json');
require_once '../includes/db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {

    case 'GET':
        $mes_id = intval($_GET['mes_id'] ?? 0);

        if (!$mes_id) {
            http_response_code(400);
            echo json_encode(['erro' => 'mes_id inválido.']);
            break;
        }

        $stmt = $pdo->prepare("SELECT * FROM contas WHERE mes_id = ? ORDER BY criado_em ASC");
        $stmt->execute([$mes_id]);
        echo json_encode($stmt->fetchAll());
        break;

    case 'POST':
        $body   = json_decode(file_get_contents('php://input'), true);
        $mes_id = intval($body['mes_id'] ?? 0);
        $nome   = trim($body['nome']   ?? '');
        $valor  = floatval($body['valor'] ?? 0);

        if (!$mes_id || empty($nome)) {
            http_response_code(400);
            echo json_encode(['erro' => 'Dados inválidos.']);
            break;
        }

        $stmt = $pdo->prepare("INSERT INTO contas (mes_id, nome, valor) VALUES (?,?,?)");
        $stmt->execute([$mes_id, $nome, $valor]);
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
            $stmt = $pdo->prepare("UPDATE contas SET pago = ? WHERE id = ?");
            $stmt->execute([intval($body['pago']), $id]);
        } elseif (isset($body['valor'])) {
            $stmt = $pdo->prepare("UPDATE contas SET valor = ? WHERE id = ?");
            $stmt->execute([floatval($body['valor']), $id]);
        }

        echo json_encode(['mensagem' => 'Conta atualizada.']);
        break;

    case 'DELETE':
        $id = intval($_GET['id'] ?? 0);

        if (!$id) {
            http_response_code(400);
            echo json_encode(['erro' => 'ID inválido.']);
            break;
        }

        $stmt = $pdo->prepare("DELETE FROM contas WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['mensagem' => 'Conta removida.']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['erro' => 'Método não permitido.']);
}