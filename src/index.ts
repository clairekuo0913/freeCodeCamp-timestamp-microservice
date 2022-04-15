import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path'

dotenv.config();
const app = express();

app.use(cors({optionsSuccessStatus: 200}));

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.resolve('views/index.html'))
});

app.get('/api/hello', (req, res) => {
  res.json({ greeting: 'hello API' });
});

let toTimestamp = (strDate: string) => Date.parse(strDate)

app.get('/api/:mili(\\d+)', (req, res) => {
  const timestamp = parseInt(req.params.mili);
  const datetime = new Date(timestamp).toUTCString();
  res.json({
    unix: timestamp,
    utc: datetime
  });
});

app.get('/api/:date?', (req, res) => {
  if (req.params.date == null) {
    let date = new Date();
    date.setMinutes(date.getMinutes());
    res.json({
      unix: date.valueOf(),
      utc: date.toUTCString()
    });
  } else {
    const datetime = new Date(req.params.date!).toUTCString();
    if (datetime == "Invalid Date") {
      res.json({
        error: datetime
      });
    } else {
      const timestamp = toTimestamp(req.params.date);
      res.json({
        unix: timestamp,
        utc: datetime
      });
    }
  }
});

const port = process.env.PORT || 3000;
const listener = app.listen(port, () => {
  const address = listener.address() as any;
  console.log('Your app is listening on port '+ address.port);
});
