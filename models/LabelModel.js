import pool from '../dbConnection.js';

class LabelModel {
    async insertLabel(label) {
        await pool.query(
            'INSERT INTO label (label_id, name, color, description, is_default, url) VALUES ($1, $2, $3, $4, $5, $6)',
            [label.id, label.name, label.color, label.description, label.is_default, label.url]
        );
    }

    async clearTable() {
        await pool.query('DELETE FROM label');
    }
}

export default new LabelModel();