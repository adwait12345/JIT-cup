const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const currentRound = parseInt(args[0], 10);
const opponentPrevious = args[1];

const filePath = path.join(__dirname, 'helpers', 'decisions.txt');

function readPreviousDecisions(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return data.split('\n').filter(line => line);
  } catch (err) {
    return [];
  }
}

function writeCurrentDecision(filePath, currentDecision) {
  try {
    fs.appendFileSync(filePath, `${currentDecision}\n`);
  } catch (err) {
    console.error('Error writing to file:', err);
  }
}

function makeDecision(currentRound, opponentPrevious, previousDecisions) {
  if (currentRound === 1 || opponentPrevious === 'NONE') {
    return 'YES'; // Default decision for the first round
  }

  const opponentDecisions = previousDecisions.map(decision => decision.split(',')[1]);

  const countNo = opponentDecisions.filter(decision => decision === 'NO').length;
  const countYes = opponentDecisions.filter(decision => decision === 'YES').length;

  // Strategy: Tit-for-tat with forgiveness
  if (opponentPrevious === 'NO') {
    if (Math.random() > 0.1) { // 90% chance to retaliate
      return 'NO';
    }
  }

  return 'YES';
}

const previousDecisions = readPreviousDecisions(filePath);
const currentDecision = makeDecision(currentRound, opponentPrevious, previousDecisions);

writeCurrentDecision(filePath, `${currentRound},${currentDecision}`);

console.log(currentDecision);
