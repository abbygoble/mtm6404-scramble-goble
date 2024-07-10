console.log('Hello World')

/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle(src) {
    const copy = [...src]

    const length = copy.length
    for (let i = 0; i < length; i++) {
        const x = copy[i]
        const y = Math.floor(Math.random() * length)
        const z = copy[y]
        copy[i] = z
        copy[y] = x
    }

    if (typeof src === 'string') {
        return copy.join('')
    }

    return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/
const { useState, useEffect } = React

const words = [
    'arrowroot',
    'barbell',
    'crocodile',
    'destination',
    'elephant',
    'firetruck',
    'goose',
    'helicopter',
    'intelligent',
    'jail'
]

function ScrambleGame() {
    const [wordList, setWordList] = useState([...words])
    const [current, setCurrent] = useState(() => {
        const shuffledWords = shuffle([...words])
        return shuffledWords[0] 
    })
    const [wordScramble, setWordScramble] = useState(() => shuffle(shuffle(current)))
    const [guess, setGuess] = useState("")
    const [score, setScore] = useState(0)
    const [strike, setStrike] = useState(0)
    const [pass, setPass] = useState(3)

    useEffect(() => {
        const storedState = localStorage.getItem('scrambleGameState')
        if (storedState) {
            const { savedWordList, savedCurrent, savedWordScramble, savedScore, savedStrike, savedPass } = JSON.parse(storedState)
            setWordList(savedWordList)
            setCurrent(savedCurrent)
            setWordScramble(savedWordScramble)
            setScore(savedScore)
            setStrike(savedStrike)
            setPass(savedPass)
        } else {
            const initialWord = shuffle([...words])[0]
            setCurrent(initialWord)
            setWordScramble(shuffle(initialWord))
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('scrambleGameState', JSON.stringify({ wordList, current, wordScramble, score, strike, pass }))
    }, [wordList, current, wordScramble, score, strike, pass])

    const passDealer = () => {
        if (pass > 0) {
            setPass(pass - 1)
            const newWordList = wordList.filter(word => word !== current)
            if (newWordList.length > 0) {
                const newWord = shuffle(newWordList)[0]
                setWordList(newWordList)
                setCurrent(newWord)
                setWordScramble(shuffle(newWord))
            } else {
                alert(`All Spelled Out! You scored ${score} points, and got ${strike}.`)
            }
        }
    }

    const guessDealer = (e) => {
        e.preventDefault()
        if (guess.toLowerCase() === current.toLowerCase()) {
            setScore(score + 1)
            const newWordList = wordList.filter(word => word !== current)
            if (newWordList.length > 0) {
                const newWord = shuffle(newWordList)[0]
                setWordList(newWordList)
                setCurrent(newWord)
                setWordScramble(shuffle(newWord))
            } else {
                alert(`All Spelled Out! You scored ${score + 1} points.`)
                resetGame()
            }
        } else {
            setStrike(strike + 1)
            if (strike + 1 >= 3) {
                alert(`All Spelled Out! You scored ${score} points, ${strike + 1} strikes.`)
                resetGame()
            }
        }
        setGuess("")
    }
    
    const resetGame = () => {
        setWordList([...words])
        const newWord = shuffle([...words])[0]
        setCurrent(newWord)
        setWordScramble(shuffle(newWord))
        setGuess('')
        setScore(0)
        setStrike(0)
        setPass(3)
        localStorage.removeItem('scrambleGameState')
    }

    return (
        <div>
            <header>
                <h1>Play the Word Scramble Game!!</h1>
                <p>There's a collection of words for you to spell out - but they've been scrambled past the point of recognition. Do you have what it takes to spell it out?</p>
                <p>To begin, click the Start the Game Button!</p>
            </header>
            <div id="container">
                <button onClick={resetGame} className="pinkButton">Start the Game</button>
                <p>Your Scrambled Word is: {wordScramble}</p>
                <form onSubmit={guessDealer}>
                    <input type="text" value={guess} onChange={(e) => setGuess(e.target.value)} />
                    <button type="submit">Enter</button>
                </form>
                <p>You have {pass} passes left!</p>
                <button onClick={passDealer} disabled={pass <= 0} className="pinkButton">Pass</button>
                <div id="sideBySide">
                    <p>Points: {score}</p>
                    <p>Strikes: {strike}</p>
                </div>
            </div>
        </div>
    )
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<ScrambleGame />)
