<?php
header('Content-Type: application/json');
require_once '../includes/db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $pdo->query("SELECT * FROM postits");
        echo json_encode($stmt->fetchAll());
        break;

    case 'POST':
        $body = json_decode(file_get_contents('php://input'), true);
        $stmt = $pdo->prepare("INSERT INTO postits (texto, pos_x, pos_y, cor) VALUES (?, ?, ?, ?)");
        $stmt->execute(['', $body['x'], $body['y'], $body['cor']]);
        echo json_encode(['id' => $pdo->lastInsertId()]);
        break;

    case 'PATCH':
        $id = intval($_GET['id']);
        $body = json_decode(file_get_contents('php://input'), true);
        
        // Atualiza texto ou posição dependendo do que for enviado
        if (isset($body['texto'])) {
            $stmt = $pdo->prepare("UPDATE postits SET texto = ? WHERE id = ?");
            $stmt->execute([$body['texto'], $id]);
        } else {
            $stmt = $pdo->prepare("UPDATE postits SET pos_x = ?, pos_y = ? WHERE id = ?");
            $stmt->execute([$body['x'], $body['y'], $id]);
        }
        echo json_encode(['status' => 'ok']);
        break;

    case 'DELETE':
        $id = intval($_GET['id']);
        $stmt = $pdo->prepare("DELETE FROM postits WHERE id = ?");
        $stmt->execute([$id]);
        break;
}