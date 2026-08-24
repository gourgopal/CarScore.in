import fs from 'fs';
import path from 'path';

const file = path.join(process.cwd(), 'src', 'data', 'raw', 'popular_cars.json');
const data = JSON.parse(fs.readFileSync(file, 'utf-8'));

function getGrade(score: number) {
  if (score >= 9) return 'A+';
  if (score >= 8.5) return 'A';
  if (score >= 8) return 'A-';
  if (score >= 7.5) return 'B+';
  if (score >= 7) return 'B';
  if (score >= 6.5) return 'B-';
  if (score >= 6) return 'C+';
  if (score >= 5.5) return 'C';
  if (score >= 5) return 'C-';
  if (score >= 4) return 'D';
  return 'F';
}

data.forEach((car: any) => {
  // Deterministic random based on ID length & characters
  let seed = car.id.length;
  car.id.split('').forEach((c: string) => seed += c.charCodeAt(0));
  
  const rng = (min: number, max: number, offset: number) => {
    const val = (Math.sin(seed + offset) + 1) / 2; // 0 to 1
    return Number((val * (max - min) + min).toFixed(1));
  };

  const scores = {
    reliability: rng(6, 9.5, 1),
    safety: rng(5, 9.5, 2),
    efficiency: rng(6, 9.8, 3),
    comfort: rng(6, 9.5, 4),
    value: rng(5, 9.5, 5),
    performance: rng(6, 9.5, 6)
  };

  const avg = Object.values(scores).reduce((a, b) => a + b, 0) / 6;
  const overall = Number(avg.toFixed(1));

  car.scores = {
    ...scores,
    overall,
    grade: getGrade(overall)
  };
});

fs.writeFileSync(file, JSON.stringify(data, null, 2));
console.log('Added scores to raw data');
