import React from 'react';
import { Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Draggable from 'react-draggable';

const useStyles = makeStyles((theme) => {
  return {
    root: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
    main: {
      position: 'absolute',
      borderRadius: '10px',
      padding: '0 0 20px 0',
      width: '50vw',
      backgroundColor: 'black',
      color: '#39ff14',
    },
    headerButtons: {
      borderRadius: '50%',
      width: '20px',
      height: '20px',
      margin: '5px 0 5px 10px',
      border: '1 solid white',
    },
    inputField: {
      background: 'transparent',
      border: 'none',
      color: '#39ff14',
      marginLeft: '10px',
      width: '90%',
    },
    minimise: {
      padding: '10px',
      width: '20vw',
      textAlign: 'center',
      backgroundColor: 'black',
      color: 'white',
      position: 'fixed',
      bottom: 0,
      cursor: 'pointer',
    },
    header: {
      marginBottom: '30px',
      backgroundColor: 'grey',
      width: '100%',
      height: '100%',
      borderRadius: '10px 10px 0 0',
    },
    text: {
      padding: '10px',
    },
  };
});

const Terminal = () => {
  const help = `Try moving the terminal around by clicking and dragging\n
          joke - I will tell you a random joke\n
          linkedin - brings you to my linkedin page\n
          github - brings you to my github page\n
          clear - clears the stuff\n`;
  const [isMinimised, setIsMinimised] = React.useState(false);
  const [history, setHistory] = React.useState<string[]>(help.split('\n'));
  const [command, setCommand] = React.useState('');
  const [pointer, setPointer] = React.useState(help.split('\n').length);
  const [state, setState] = React.useState({
    isDragging: false,
    origin: { x: 0, y: 0 },
    translation: { x: window.innerWidth / 3, y: window.innerHeight / 2.5 },
    lastTranslation: { x: window.innerWidth / 3, y: window.innerHeight / 2.5 },
  });
  const { isDragging } = state;
  const handleMouseDown = ({ clientX, clientY }: any) => {
    if (!isDragging)
      setState({
        ...state,
        isDragging: true,
        origin: { x: clientX, y: clientY },
      });
  };

  const handleMouseMove = ({ clientX, clientY }: any) => {
    if (isDragging) {
      const { origin, lastTranslation } = state;
      setState({
        ...state,
        translation: {
          x: Math.abs(clientX - (origin.x + lastTranslation.x)),
          y: Math.abs(clientY - (origin.y + lastTranslation.y)),
        },
      });
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      const { translation } = state;
      setState({
        ...state,
        isDragging: false,
        lastTranslation: { x: translation.x, y: translation.y },
      });
    }
    console.log(state);
  };

  const handleEnter = (event: any) => {
    if (event.key === 'Enter') {
      let res = '';
      switch (command) {
        case 'linkedin':
          window.open('https://www.linkedin.com/in/shrmnl/', '_blank');
          res = 'sending you to linkedin now...';
          break;
        case 'github':
          window.open('https://github.com/shermanleejm', '_blank');
          res = 'sending you to github now...';
          break;
        case 'joke':
          let jokes = [
            "I'm afraid for the calendar. Its days are numbered.",
            'My wife said I should do lunges to stay in shape. That would be a big step forward.',
            "Singing in the shower is fun until you get soap in your mouth. Then it's a soap opera.",
            "What do a tick and the Eiffel Tower have in common? They're both Paris sites.",
            'What do you call a fish wearing a bowtie? Sofishticated.',
            'How do you follow Will Smith in the snow? You follow the fresh prints.',
            'If April showers bring May flowers, what do May flowers bring? Pilgrims.',
            'I thought the dryer was shrinking my clothes. Turns out it was the refrigerator all along.',
            'You. TROLOLOLOL',
          ];
          res = jokes[Math.floor(Math.random() * jokes.length)];
          break;
        case 'clear':
          setHistory(help.split('\n'));
          break;
        case 'help':
          res = help;
          break;
        default:
          res = `${command} is not a valid command, type help for options.`;
      }
      if (command !== 'clear') {
        let tmp = history;
        tmp.push('> ' + command);
        res.split('\n').map((row) => tmp.push(row));
        setHistory(tmp);
      }
      setCommand('');
      setPointer(history.length);
    } else if (event.key === 'ArrowUp' && pointer > help.split('\n').length) {
      setPointer(pointer - 2);
      setCommand(history[pointer].substring(2));
    } else if (
      event.key === 'ArrowDown' &&
      history.length > help.split('\n').length &&
      pointer <= history.length
    ) {
      setPointer(pointer + 2);
      setCommand(history[pointer].substring(2));
    }
  };

  const classes = useStyles();
  return (
    <div className={classes.root} id="scrolling">
      {pointer}
      <br />
      {history.length}
      <br />
      {history[pointer]}
      {isMinimised ? (
        <Paper
          className={classes.minimise}
          onClick={() => {
            setIsMinimised(false);
          }}
        >
          TERMINAL
        </Paper>
      ) : (
        <Draggable>
          <Paper
            className={classes.main}
            elevation={3}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{
              right: `${state.translation.x}px`,
              bottom: `${state.translation.y}px`,
            }}
          >
            <div className={classes.header}>
              <button
                className={classes.headerButtons}
                style={{ backgroundColor: 'red' }}
                onClick={() => {
                  alert('Now why would you want to close my lovely creation?');
                  setHistory(help.split('\n'));
                  setIsMinimised(true);
                }}
              ></button>
              <button
                className={classes.headerButtons}
                style={{ backgroundColor: 'yellow' }}
                onClick={() => setIsMinimised(true)}
              ></button>
              <button
                className={classes.headerButtons}
                style={{ backgroundColor: 'green' }}
                onClick={() => alert('ARE YOU TRYING TO KILL ME WITH CSS?????????')}
              ></button>
            </div>
            <div className={classes.text}>
              {history.map((row: string) => {
                return <Typography>{row}</Typography>;
              })}
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', padding: '0 0 0 10px' }}>
              {'>'}
              <input
                className={classes.inputField}
                onChange={(event) => {
                  setCommand(event.target.value);
                }}
                value={command}
                onKeyDown={handleEnter}
                autoCapitalize="none"
                placeholder="type here"
              ></input>
            </div>
          </Paper>
        </Draggable>
      )}
    </div>
  );
};

export default Terminal;
