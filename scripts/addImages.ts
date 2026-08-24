import fs from 'fs';
import path from 'path';

const file = path.join(process.cwd(), 'src', 'data', 'raw', 'popular_cars.json');
const data = JSON.parse(fs.readFileSync(file, 'utf-8'));

data.forEach((car: any) => {
  car.imageUrl = `/images/cars/${car.id}.jpg`;
});

fs.writeFileSync(file, JSON.stringify(data, null, 2));
console.log('Added imageUrl to raw data');
