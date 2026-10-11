// Tiny JSON-file store with the subset of the Mongoose API this project uses.
// Used automatically when MONGODB_URI is empty (local development / demos only).
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const DIR = path.join(__dirname, "../../data");

class Query {
  constructor(rows) { this.rows = rows; this._sort = null; this._skip = 0; this._limit = Infinity; }
  sort(s) { this._sort = s; return this; }
  skip(n) { this._skip = n; return this; }
  limit(n) { this._limit = n; return this; }
  lean() { return this; }
  then(res, rej) {
    let r = [...this.rows];
    if (this._sort) {
      const [[k, dir]] = Object.entries(this._sort);
      r.sort((a, b) => (a[k] > b[k] ? 1 : a[k] < b[k] ? -1 : 0) * (dir < 0 ? -1 : 1));
    }
    return Promise.resolve(r.slice(this._skip, this._skip + this._limit)).then(res, rej);
  }
}

const matches = (row, filter = {}) => Object.entries(filter).every(([k, v]) => row[k] === v);

function createLocalModel(name, defaults = {}) {
  const file = path.join(DIR, `${name}.json`);
  const read = () => { try { return JSON.parse(fs.readFileSync(file, "utf8")); } catch { return []; } };
  const write = (rows) => { fs.mkdirSync(DIR, { recursive: true }); fs.writeFileSync(file, JSON.stringify(rows, null, 2)); };
  return {
    async create(doc) {
      const now = new Date().toISOString();
      const row = { ...defaults, ...doc, _id: crypto.randomBytes(12).toString("hex"), createdAt: now, updatedAt: now };
      const rows = read(); rows.push(row); write(rows);
      return row;
    },
    find: (filter) => new Query(read().filter((r) => matches(r, filter))),
    async countDocuments(filter) { return read().filter((r) => matches(r, filter)).length; },
    async findById(id) { return read().find((r) => r._id === id) || null; },
    async findByIdAndUpdate(id, update) {
      const rows = read(); const i = rows.findIndex((r) => r._id === id);
      if (i < 0) return null;
      rows[i] = { ...rows[i], ...update, updatedAt: new Date().toISOString() }; write(rows);
      return rows[i];
    },
  };
}

module.exports = { createLocalModel };
