import { useState, useEffect } from "react";
import Board from './Board';
import LeaderBoard from './LeaderBoard';

type User = {
  id: number,
  name: string;
  guesses: string;
};

// TODO colour blind mode

export default function Game() {
  const [currentValues, setCurrentValues] = useState(Array(4).fill(''));
  const [prevGuessResults, setPrevGuessResults] = useState(Array(0));
  const [answer, setAnswer] = useState(getNewAnswer());
  const [submittedRows, setSubmittedRows] = useState(Array(0));
  const [users, setUsers] = useState(Array<User>(0));
  const [singleGuessUsers, setSingleGuessUsers] = useState(Array<User>(0));
  const url = "https://mastermind-data.vercel.app/api/users";

  const fetchData = async () => {
    try {
      const response = await fetch(url);
      let users = await response.json() as Array<User>;

      setUsers(users);
      setSingleGuessUsers(users.filter(function (u) {
        return u.guesses.toString() === '1';
      }));
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const postData = async (newWinnerName: string) => {
    try {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newWinnerName, guesses: submittedRows.length })
      };
      await fetch(url, requestOptions);
    } catch (error) {
      console.log("error", error);
    }
    fetchData();
  };

  const updateUser = async (newWinnerName: string) => {
    try {
      const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      };
      var putUrl = url + '/' + newWinnerName + '/' + submittedRows.length
      await fetch(putUrl, requestOptions);
    } catch (error) {
      console.log("error", error);
    }
    fetchData();
  };

  function handleSubmit() {
    setSubmittedRows([...submittedRows, currentValues]);

    let answerRow = answer.slice();
    let guessRow = currentValues.slice();
    let markers = [];

    //perfect matches
    for (let i = 0; i < 4; i++) {
      if (guessRow[i] === answerRow[i]) {
        markers.push('c');
        delete (guessRow[i]);
        delete (answerRow[i]);
      }
    }

    //imperfect matches
    for (let i in guessRow) {
      for (let j in answerRow) {
        if (guessRow[i] === answerRow[j]) {
          markers.push('h');
          delete (guessRow[i])
          delete (answerRow[j])
        }
      }
    }

    for (let index = 0; index < 4; index++) {
      if (markers.length === 4) {
        break
      } else {
        markers.push('');
      };
    }

    setPrevGuessResults([...prevGuessResults, markers]);
    setCurrentValues(Array(4).fill(''));

  }

  function setNewWinnerName(newWinnerName: string) {
    const existingUser = users.find((u) => { return u.name === newWinnerName });
    if (existingUser && Number(existingUser.guesses) > submittedRows.length) {
      updateUser(newWinnerName)
    }
    else if (!existingUser) {
      postData(newWinnerName);
    }
  }

  function updateCurrentRow(circleId: number, newValue: string) {
    setCurrentValues(currentValues.map((value, i) => {
      if (i === circleId) return newValue;
      return value;
    }));
  }

  function getNewAnswer() {
    const colours = ['pink', 'red', 'orange', 'yellow', 'green', 'lightblue', 'blue', 'purple', ''];
    let newAnswer = Array(4).fill(null);
    for (let i = 0; i < 4; i++) {
      newAnswer[i] = colours[Math.floor(Math.random() * colours.length)];
    };
    return newAnswer;
  }

  function handleNewGameClick() {
    setCurrentValues(Array(4).fill(''));
    setPrevGuessResults(Array(0));
    setAnswer(getNewAnswer());
    setSubmittedRows(Array(0));
  }

  return (
    <div className="board-container">
      < Board currentRow={currentValues} handleSubmit={handleSubmit} updateCurrentRow={updateCurrentRow} markers={prevGuessResults} handleNewWinnerName={setNewWinnerName} submittedRows={submittedRows} />
      <button className="submit-button" onClick={handleNewGameClick}>
        New Game
      </button>
      {users.length > 0 ? <LeaderBoard users={users} title='Leaderboard' /> : <></>}
      {singleGuessUsers.length > 0 ? <LeaderBoard users={singleGuessUsers} title='Hall of fame/shame' subtitle="Guessed it in one? Suspicious..." /> : <></>}
    </div>
  )
}
