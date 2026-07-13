import Dexie, { type Table } from "dexie";

import type { CalculatorValues, DisplayOperator } from "./calculator";

export interface HistoryEntry {
  readonly id?: number;
  readonly a: number;
  readonly op: DisplayOperator;
  readonly b: number;
  readonly timestamp: number;
}

class CalcTrickDatabase extends Dexie {
  public history!: Table<HistoryEntry, number>;

  public constructor() {
    super("calctrick");
    this.version(1).stores({
      history: "++id,timestamp",
    });
  }
}

let database: CalcTrickDatabase | null = null;

function getDatabase(): CalcTrickDatabase | null {
  if (typeof indexedDB === "undefined") {
    return null;
  }

  database ??= new CalcTrickDatabase();
  return database;
}

export async function saveCalculation(values: CalculatorValues): Promise<void> {
  const db = getDatabase();
  if (db === null) {
    return;
  }

  await db.history.add({
    ...values,
    timestamp: Date.now(),
  });
}

export async function getRecentCalculations(limit = 5): Promise<HistoryEntry[]> {
  const db = getDatabase();
  if (db === null) {
    return [];
  }

  return db.history.orderBy("timestamp").reverse().limit(limit).toArray();
}
