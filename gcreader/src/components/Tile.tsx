import React from "react";

interface TileProps {
    title: string;
    start: string;
    end: string;
}

const Tile: React.FC<TileProps> = ({ title, start, end }) => {
    // 日付をJSTに変換し、時分のみを抽出する関数
    const formatTimeJST = (dateString: string) => {
        const date = new Date(dateString);
        // JSTに変換（UTC+9）
        date.setHours(date.getHours() + 0);
        // Intl.DateTimeFormatを使用して、時分のみを抽出
        return new Intl.DateTimeFormat('ja-JP', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/London' }).format(date);
    };

    return (
        <div style={{ 
            border: '1px solid #222',
            borderRadius: '5px',
            padding: '10px',
            margin: '10px',
            backgroundColor: '#FEFEEFF',
            borderRadius: '5px'
        }}>
            <h2>{title}</h2>
            <div style={{ display: 'flex' }}>
                <p>{formatTimeJST(start)}</p>
                <p>~</p>
                <p>{formatTimeJST(end)}</p>
            </div>
        </div>
    );
};
export default Tile;