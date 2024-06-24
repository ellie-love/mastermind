import './App.css';

type Props = {
    circles: Array<string>;
    markers: Array<string>;
};

export default function Row({ circles, markers }: Props) {
    const gridSize = 2;
    return (
        <div className="rowFlex">
            <div className="circle-grid">
                {circles.map((circle, index) => (
                    <button
                        key={`circle-${index}`}
                        data-testid="circle"
                        className={`circles ${circle}`}
                    />
                ))}
            </div>
            <div className="markers">
                {Array.from({ length: gridSize }).map((_, row) => (
                    <div key={`row-${row}`} className="board-row">
                        {Array.from({ length: gridSize }).map((_, col) => {
                            const markerIndex = row * gridSize + col;
                            const marker = markers[markerIndex] || '';
                            const markerClass =
                                marker === 'c'
                                    ? 'exact'
                                    : marker === 'h'
                                        ? 'partial'
                                        : '';

                            return (
                                <span
                                    key={`marker-${markerIndex}`}
                                    className={`marker ${markerClass}`}
                                    data-testid="marker"
                                ></span>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}