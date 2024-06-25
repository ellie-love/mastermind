import { useState } from 'react';
//import Button from 'react-bootstrap/Button';
import './App.css';
import Row from './Row';

type Props = {
    currentRow: Array<string>;
    handleSubmit: Function;
    updateCurrentRow: Function;
    markers: Array<Array<string>>;
    handleNewWinnerName: Function;
    submittedRows: Array<Array<string>>;
};

export default function Board({ currentRow, handleSubmit, updateCurrentRow, markers, handleNewWinnerName, submittedRows }: Props) {
    const [name, setName] = useState('');
    const [nameError, setNameError] = useState('');

    const colours = ['pink', 'red', 'orange', 'yellow', 'green', 'lightblue', 'blue', 'purple'];

    const isVictory = markers.length > 0
        && markers[markers.length - 1].length === 4
        && markers[markers.length - 1].every((val) => val === 'c');

    function handleClick(circleId: number) {
        const currentValue = currentRow[circleId];
        let newValue = 'pink';

        //tidy up this logic!
        if (currentValue === 'purple') {
            newValue = '';
        } else if (currentValue) {
            const currentIndex = colours.findIndex((x) => currentValue === x);
            newValue = colours[currentIndex + 1];
        }

        updateCurrentRow(circleId, newValue);
    }

    function handleNameSubmitted(name: string) {
        const validNameRegex = /^[a-zA-Z0-9\s-]+$/;
        if (!validNameRegex.test(name)) {
            setNameError('There are invalid characters in the name. Please only enter letters, numbres, hyphens and spaces.');
        } else if (name.trim() === '') {
            setNameError('Name cannot be empty.');
        } else if (name.length > 35) {
            setNameError('Name is too long. Please enter a shortened version.');
        } else {
            handleNewWinnerName(name.trim());
            setName('');
            setNameError('');
        }
    }

    const rows = submittedRows.map((circles, rowNumber) => (
        <li className="row" key={rowNumber}>
            <Row circles={circles} markers={markers[rowNumber]} />
        </li>
    ));

    return (
        <>
            <h2>MasterMind</h2>
            <p>
                Try to guess the colour code in as few turns as possible. There
                are eight possible colours, plus blanks. After submitting a
                guess, you will receive hints about how close you came to the
                secret code. A green square means you guessed a circle in the
                correct position and colour. Yellow indicates a correct colour
                in an incorrect position.
            </p>
            <div className="rowFlex">
                <ul>
                    {rows}
                    {!isVictory ? (
                        <li className="row">
                            {currentRow.map((circle, index) => (
                                <button
                                    key={`circle-${index}`}
                                    data-testid="circle"
                                    className={`circles ${circle}`}
                                    onClick={() => handleClick(index)}
                                />
                            ))}
                            <button
                                className="go-button"
                                onClick={() => handleSubmit(currentRow)}
                            >
                                Go
                            </button>
                        </li>
                    ) : (
                        <>
                            <p>YOU WIN!</p>
                            <p>Enter your name to be added to the leaderboard. If you already have an entry, only your best score will be kept.</p>
                            <input
                                onChange={(e) => {
                                    setName(e.target.value);
                                    setNameError('');
                                }}
                                value={name}
                            />
                            <button
                                onClick={() => handleNameSubmitted(name)}
                            >
                                Submit
                            </button>
                            {nameError && (
                                <p className="error-message">{nameError}</p>
                            )}
                        </>
                    )}
                </ul>
            </div>
        </>
    );
}