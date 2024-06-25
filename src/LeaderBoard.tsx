import './App.css';

type User = {
    id: number,
    name: string;
    guesses: string;
};

type Props = {
    users: Array<User>,
    title: string,
    subtitle?: string
}


export default function LeaderBoard({ users, title, subtitle }: Props) {

    return (
        <div className="leaderboard-container">
            <h2 className="leaderboard-title">{title}</h2>
            <p className="leaderboard-title">{subtitle}</p>
            <ul className="user-list">
                <li className="user-header">
                    <span className="header-name">Name</span>
                    <span className="header-guesses">Turns</span>
                </li>
                {users
                    .sort((x, y) => { return Number(x.guesses) - Number(y.guesses) })
                    .map((u, index) => (
                        <li key={u.id} className={`user-item ${index % 2 === 0 ? 'even-row' : 'odd-row'}`}>
                            <div className="user-content">
                                <span className="user-name">
                                    {u.name.length > 23
                                        ? u.name.substring(0, 20) + '...'
                                        : u.name}
                                </span>
                                <span className="user-guesses">
                                    {u.guesses}
                                </span>
                            </div>
                        </li>
                    ))}
            </ul>
        </div>
    );
}